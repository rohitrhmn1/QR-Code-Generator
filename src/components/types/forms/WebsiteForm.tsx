import { useForm } from "react-hook-form";
import type { WebsiteFormData } from "@components/types/forms";
import { Globe } from "lucide-react";

interface WebsiteFormProps {
  onSubmit: (data: WebsiteFormData) => void;
  defaultValues?: Partial<WebsiteFormData>;
}

export const WebsiteForm = ({ onSubmit, defaultValues }: WebsiteFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WebsiteFormData>({
    defaultValues: {
      url: defaultValues?.url || "https://",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="url"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          <Globe className="w-4 h-4 inline mr-2 text-primary-600" />
          Website URL
        </label>
        <input
          id="url"
          type="url"
          {...register("url", {
            required: "URL is required",
            pattern: {
              value: /^https?:\/\/.+/i,
              message:
                "Please enter a valid URL starting with http:// or https://",
            },
          })}
          placeholder="https://example.com"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-200/50 outline-none transition-all bg-white/70 backdrop-blur-sm hover:bg-white"
        />
        {errors.url && (
          <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
        )}
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
