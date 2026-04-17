"use client";

import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import proxy from "@/lib/proxy";
import toast from "react-hot-toast";
import { X, CreditCard, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Initialize Stripe
const envStripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const envStripePromise = envStripeKey ? loadStripe(envStripeKey) : null;

if (!envStripeKey) {
  console.warn(
    "⚠️  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY not found. Falling back to backend Stripe config endpoint."
  );
}

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
  amount: number;
  onSuccess: () => void;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    if (response?.data?.message) return response.data.message;
  }

  return fallback;
};

// Payment Form Component
function PaymentForm({
  bookingId,
  amount,
  onSuccess,
  onClose,
}: {
  bookingId: number;
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    // Create payment intent when component mounts
    const createIntent = async () => {
      try {
        setLoading(true);
        const response = await proxy.post("/stripe/create-intent", {
          bookingId,
        });

        if (response.data.success) {
          setClientSecret(response.data.clientSecret);
        }
      } catch (error: unknown) {
        console.error("Error creating payment intent:", error);
        toast.error(getErrorMessage(error, "Failed to initialize payment"));
        onClose();
      } finally {
        setLoading(false);
      }
    };

    createIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        toast.error("Card element not found");
        return;
      }

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        toast.error(error.message || "Payment failed");
        setLoading(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        // Verify payment with backend
        const verifyResponse = await proxy.post("/stripe/verify", {
          paymentIntentId: paymentIntent.id,
        });

        if (verifyResponse.data.success) {
          toast.success("Payment successful! 🎉");
          onSuccess();
          onClose();
        } else {
          toast.error("Payment verification failed");
        }
      }
    } catch (error: unknown) {
      console.error("Payment error:", error);
      toast.error(getErrorMessage(error, "Payment processing failed"));
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Amount Display */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <div className="flex justify-between items-center">
          <span className="text-slate-600 font-medium">Total Amount</span>
          <span className="text-2xl font-bold text-slate-900">
            ৳{amount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Card Element */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700">Card Details</label>
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {/* Test Card Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-2">💳 Test Card:</p>
        <p>Card: 4242 4242 4242 4242</p>
        <p>Expiry: Any future date</p>
        <p>CVC: Any 3 digits</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !stripe || !clientSecret}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin h-5 w-5" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            Pay ৳{amount.toFixed(2)}
          </>
        )}
      </button>
    </form>
  );
}

// Main Modal Component
export default function StripePaymentModal({
  isOpen,
  onClose,
  bookingId,
  amount,
  onSuccess,
}: StripePaymentModalProps) {
  const [stripePromise, setStripePromise] = useState(envStripePromise);
  const [configLoading, setConfigLoading] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || stripePromise) return;

    const fetchStripeConfig = async () => {
      try {
        setConfigLoading(true);
        const response = await proxy.get("/stripe/config");
        const publishableKey = response.data?.publishableKey as string | undefined;

        if (response.data?.success && publishableKey) {
          setStripePromise(loadStripe(publishableKey));
          setConfigError(null);
          return;
        }

        setConfigError(
          response.data?.message ||
            "Stripe publishable key is not configured."
        );
      } catch (error: unknown) {
        setConfigError(getErrorMessage(error, "Failed to load Stripe configuration."));
      } finally {
        setConfigLoading(false);
      }
    };

    void fetchStripeConfig();
  }, [isOpen, stripePromise]);

  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              Secure Payment
            </AlertDialogTitle>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        </AlertDialogHeader>

        <div className="py-4">
          {configLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-5 w-5 animate-spin mx-auto text-purple-600" />
              <p className="text-sm text-slate-500 mt-3">Loading payment setup...</p>
            </div>
          ) : stripePromise ? (
            <Elements stripe={stripePromise}>
              <PaymentForm
                bookingId={bookingId}
                amount={amount}
                onSuccess={onSuccess}
                onClose={onClose}
              />
            </Elements>
          ) : (
            <div className="text-center py-8 space-y-4">
              <p className="text-slate-600 font-medium">
                Stripe is not configured
              </p>
              <p className="text-sm text-slate-500">
                Please add{" "}
                <code className="bg-slate-100 px-2 py-1 rounded">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>{" "}
                in <code className="bg-slate-100 px-2 py-1 rounded mx-1">frontend/.env.local</code>{" "}
                or{" "}
                <code className="bg-slate-100 px-2 py-1 rounded mx-1">STRIPE_PUBLISHABLE_KEY</code>{" "}
                in{" "}
                <code className="bg-slate-100 px-2 py-1 rounded mx-1">backend/.env</code>.
              </p>
              {configError && <p className="text-xs text-red-500 mt-3">{configError}</p>}
            </div>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
