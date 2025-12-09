import { useForm, Controller } from "react-hook-form";
import type { WiFiFormData } from "@components/types/forms";
import { Wifi } from "lucide-react";
import { Select } from "@/components/ui/Select";

interface WiFiFormProps {
  onSubmit: (data: WiFiFormData) => void;
  defaultValues?: Partial<WiFiFormData>;
}

const securityOptions = [
  { display_name: "WPA/WPA2", value: "WPA" },
  { display_name: "WPA2", value: "WPA2" },
  { display_name: "WEP", value: "WEP" },
  { display_name: "No Password", value: "nopass" },
];

export const WiFiForm = ({ onSubmit, defaultValues }: WiFiFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<WiFiFormData>({
    defaultValues: {
      ssid: defaultValues?.ssid || "",
      password: defaultValues?.password || "",
      security: defaultValues?.security || "WPA",
      hidden: defaultValues?.hidden || false,
    },
  });

  const security = watch("security");
  const requiresPassword = security !== "nopass";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="ssid"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          <Wifi className="w-4 h-4 inline mr-2 text-primary-600" />
          Network Name (SSID)
        </label>
        <input
          id="ssid"
          type="text"
          {...register("ssid", {
            required: "Network name is required",
          })}
          placeholder="MyWiFiNetwork"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-200/50 outline-none transition-all bg-white/70 backdrop-blur-sm hover:bg-white"
        />
        {errors.ssid && (
          <p className="mt-1 text-sm text-red-600">{errors.ssid.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="security"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Security Type
        </label>
        <Controller
          name="security"
          control={control}
          rules={{ required: "Security type is required" }}
          render={({ field }) => (
            <Select
              id="security"
              options={securityOptions}
              value={field.value}
              onValueChange={field.onChange}
              placeholder="Select security type"
              className="focus:border-primary-500 focus:ring-4 focus:ring-primary-200/50 bg-white/70 backdrop-blur-sm hover:bg-white"
            />
          )}
        />
        {errors.security && (
          <p className="mt-1 text-sm text-red-600">{errors.security.message}</p>
        )}
      </div>

      {requiresPassword && (
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: requiresPassword
                ? "Password is required for secured networks"
                : false,
            })}
            placeholder="WiFi password"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-200/50 outline-none transition-all bg-white/70 backdrop-blur-sm hover:bg-white"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>
      )}

      <div>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            {...register("hidden")}
            className="w-4 h-4 accent-primary-600 cursor-pointer"
          />
          <span className="text-sm font-medium text-slate-700 group-hover:text-primary-600 transition-colors">
            Hidden Network
          </span>
        </label>
        <p className="mt-1 text-xs text-slate-600">
          Check this if your network doesn't broadcast its SSID
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
