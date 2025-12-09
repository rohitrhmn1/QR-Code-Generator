import { useForm } from "react-hook-form";
import type { EmailFormData } from "@components/types/forms";
import { Mail } from "lucide-react";

interface EmailFormProps {
  onSubmit: (data: EmailFormData) => void;
  defaultValues?: Partial<EmailFormData>;
}

export const EmailForm = ({ onSubmit, defaultValues }: EmailFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    defaultValues: {
      email: defaultValues?.email || "",
      subject: defaultValues?.subject || "",
      body: defaultValues?.body || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          <Mail className="w-4 h-4 inline mr-2 text-primary-600" />
          Email Address
        </label>
        <input
          id="email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          placeholder="contact@example.com"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-200/50 outline-none transition-all bg-white/70 backdrop-blur-sm hover:bg-white"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Subject (Optional)
        </label>
        <input
          id="subject"
          type="text"
          {...register("subject")}
          placeholder="Email subject"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-200/50 outline-none transition-all bg-white/70 backdrop-blur-sm hover:bg-white"
        />
      </div>

      <div>
        <label
          htmlFor="body"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Message (Optional)
        </label>
        <textarea
          id="body"
          {...register("body")}
          placeholder="Email message"
          rows={4}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-200/50 outline-none transition-all bg-white/70 backdrop-blur-sm hover:bg-white resize-none"
        />
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
