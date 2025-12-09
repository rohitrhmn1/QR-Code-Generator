import { useForm } from "react-hook-form";
import type { PhoneFormData } from "@components/types/forms";
import { Phone } from "lucide-react";

interface PhoneFormProps {
  onSubmit: (data: PhoneFormData) => void;
  defaultValues?: Partial<PhoneFormData>;
}

export const PhoneForm = ({ onSubmit, defaultValues }: PhoneFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneFormData>({
    defaultValues: {
      phoneNumber: defaultValues?.phoneNumber || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          <Phone className="w-4 h-4 inline mr-2 text-primary-600" />
          Phone Number
        </label>
        <input
          id="phoneNumber"
          type="tel"
          {...register("phoneNumber", {
            required: "Phone number is required",
            pattern: {
              value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
              message: "Please enter a valid phone number",
            },
          })}
          placeholder="+1234567890"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-200/50 outline-none transition-all bg-white/70 backdrop-blur-sm hover:bg-white"
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-sm text-red-600">
            {errors.phoneNumber.message}
          </p>
        )}
        <p className="mt-2 text-xs text-slate-600">
          Include country code for international numbers (e.g., +1 for USA)
        </p>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-bold rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl"
      >
        Generate QR Code
      </button>
    </form>
  );
};
