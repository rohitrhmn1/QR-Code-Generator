import Modal from "@/components/ui/Modal";
import {
  generateEmailQR,
  generatePhoneQR,
  generateWebsiteQR,
  generateWiFiQR,
} from "@/lib/qr-utils";
import type {
  EmailFormData,
  PhoneFormData,
  PresetType,
  WebsiteFormData,
  WiFiFormData,
} from "@components/types/forms";
import { EmailForm } from "@components/types/forms/EmailForm";
import { PhoneForm } from "@components/types/forms/PhoneForm";
import { WebsiteForm } from "@components/types/forms/WebsiteForm";
import { WiFiForm } from "@components/types/forms/WiFiForm";
import {
  ChevronDown,
  ChevronRight,
  Download,
  Globe,
  Image as ImageIcon,
  Mail,
  Palette,
  Phone,
  Settings,
  Wifi,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";
type LogoShape = "square" | "circle" | "rounded";

interface QRConfig {
  text: string;
  size: number;
  fgColor: string;
  bgColor: string;
  level: ErrorCorrectionLevel;
  logoUrl: string;
  logoSize: number;
  logoOpacity: number;
  logoShape: LogoShape;
}

function App() {
  const qrRef = useRef<HTMLDivElement>(null);
  const finalCanvasRef = useRef<HTMLCanvasElement>(null);

  const [config, setConfig] = useState<QRConfig>({
    text: "https://example.com",
    size: 256,
    fgColor: "#000000",
    bgColor: "#ffffff",
    level: "M",
    logoUrl: "",
    logoSize: 50,
    logoOpacity: 1,
    logoShape: "rounded",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [logoFile, setLogoFile] = useState<string>("");
  const [activeModal, setActiveModal] = useState<PresetType | null>(null);

  const updateConfig = (
    key: keyof QRConfig,
    value: string | number | boolean
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoFile(result);
        updateConfig("logoUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate QR code with logo on canvas
  useEffect(() => {
    const generateQRCanvas = async () => {
      const sourceCanvas = qrRef.current?.querySelector("canvas");
      const finalCanvas = finalCanvasRef.current;
      if (!sourceCanvas || !finalCanvas) return;

      const ctx = finalCanvas.getContext("2d");
      if (!ctx) return;

      // Add 10px margin for download
      const margin = 10;

      // Set canvas size to include margin
      finalCanvas.width = sourceCanvas.width + margin * 2;
      finalCanvas.height = sourceCanvas.height + margin * 2;

      // Fill background with the QR code background color
      ctx.fillStyle = config.bgColor;
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

      // Draw the QR code with margin offset
      ctx.drawImage(sourceCanvas, margin, margin);

      // If there's a logo, draw it on top
      if (logoFile) {
        const logo = new Image();
        logo.crossOrigin = "anonymous";

        await new Promise<void>((resolve, reject) => {
          logo.onload = () => {
            // Scale the logo size to match canvas scaling
            const scale = sourceCanvas.width / config.size;
            const logoContainerSize = config.logoSize * scale;

            // Logo inner padding (p-1 = 0.25rem = 4px)
            const logoPadding = 4 * scale;
            const actualLogoSize = logoContainerSize - logoPadding * 2;

            // Center the logo container including padding offset
            const containerX = (finalCanvas.width - logoContainerSize) / 2;
            const containerY = (finalCanvas.height - logoContainerSize) / 2;

            // Logo image position with padding
            const logoX = containerX + logoPadding;
            const logoY = containerY + logoPadding;

            // Save context state
            ctx.save();

            // Draw white background container with shape
            ctx.globalAlpha = 1; // Full opacity for background
            ctx.fillStyle = "#ffffff";

            ctx.beginPath();
            if (config.logoShape === "circle") {
              const radius = logoContainerSize / 2;
              ctx.arc(
                containerX + radius,
                containerY + radius,
                radius,
                0,
                Math.PI * 2
              );
            } else if (config.logoShape === "rounded") {
              const radius = logoContainerSize * 0.15;
              ctx.roundRect(
                containerX,
                containerY,
                logoContainerSize,
                logoContainerSize,
                radius
              );
            } else {
              // square
              ctx.rect(
                containerX,
                containerY,
                logoContainerSize,
                logoContainerSize
              );
            }
            ctx.closePath();
            ctx.fill();

            // Set opacity for logo
            ctx.globalAlpha = config.logoOpacity;

            // Create clipping path for logo image (smaller, with padding)
            ctx.beginPath();
            if (config.logoShape === "circle") {
              const radius = actualLogoSize / 2;
              ctx.arc(logoX + radius, logoY + radius, radius, 0, Math.PI * 2);
            } else if (config.logoShape === "rounded") {
              const radius = actualLogoSize * 0.15;
              ctx.roundRect(
                logoX,
                logoY,
                actualLogoSize,
                actualLogoSize,
                radius
              );
            } else {
              // square
              ctx.rect(logoX, logoY, actualLogoSize, actualLogoSize);
            }
            ctx.closePath();
            ctx.clip();

            // Draw the logo
            ctx.drawImage(logo, logoX, logoY, actualLogoSize, actualLogoSize);

            // Restore context state
            ctx.restore();

            resolve();
          };
          logo.onerror = reject;
          logo.src = logoFile;
        }).catch(() => {
          console.error("Failed to load logo");
        });
      }
    };

    // Small delay to ensure QR canvas is rendered
    const timer = setTimeout(generateQRCanvas, 100);
    return () => clearTimeout(timer);
  }, [config, logoFile]);

  const downloadQR = () => {
    const canvas = finalCanvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = url;
    link.click();
  };

  const handleWebsiteSubmit = (data: WebsiteFormData) => {
    const qrText = generateWebsiteQR(data);
    updateConfig("text", qrText);
    setActiveModal(null);
  };

  const handleEmailSubmit = (data: EmailFormData) => {
    const qrText = generateEmailQR(data);
    updateConfig("text", qrText);
    setActiveModal(null);
  };

  const handlePhoneSubmit = (data: PhoneFormData) => {
    const qrText = generatePhoneQR(data);
    updateConfig("text", qrText);
    setActiveModal(null);
  };

  const handleWiFiSubmit = (data: WiFiFormData) => {
    const qrText = generateWiFiQR(data);
    updateConfig("text", qrText);
    setActiveModal(null);
  };

  const presets = [
    { name: "Website", icon: Globe, type: "website" as PresetType },
    { name: "Email", icon: Mail, type: "email" as PresetType },
    { name: "Phone", icon: Phone, type: "phone" as PresetType },
    { name: "WiFi", icon: Wifi, type: "wifi" as PresetType },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            QR Code Generator
          </h1>
          <p className="text-xl text-white/90 drop-shadow-md">
            Create customizable QR codes with logos, colors, and more
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Quick Presets */}
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 hover:shadow-glow transition-all duration-300">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-4">
                Quick Presets
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setActiveModal(preset.type)}
                    className="flex items-center gap-2 p-3 bg-gradient-to-r from-primary-50 to-accent-50 hover:from-primary-100 hover:to-accent-100 rounded-lg transition-all duration-200 border border-primary-200 hover:border-primary-300 hover:shadow-md"
                  >
                    <preset.icon className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-medium text-slate-700">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Input */}
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 hover:shadow-glow transition-all duration-300">
              <label className="block text-sm font-semibold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
                Content (URL, Text, etc.)
              </label>
              <textarea
                value={config.text}
                onChange={(e) => updateConfig("text", e.target.value)}
                placeholder="Enter URL, text, or any data..."
                className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-200/50 outline-none transition-all resize-none bg-white/70 backdrop-blur-sm hover:bg-white"
                rows={4}
              />
              <p className="mt-2 text-xs text-slate-600 font-medium">
                {config.text.length} characters
              </p>
            </div>

            {/* Basic Settings */}
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 hover:shadow-glow transition-all duration-300">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary-600" />
                Basic Settings
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Size: {config.size}px
                  </label>
                  <input
                    type="range"
                    min="128"
                    max="512"
                    step="32"
                    value={config.size}
                    onChange={(e) =>
                      updateConfig("size", parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-primary-100 rounded-lg appearance-none cursor-pointer accent-primary-600 hover:accent-primary-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Error Correction Level
                  </label>
                  <select
                    value={config.level}
                    onChange={(e) =>
                      updateConfig(
                        "level",
                        e.target.value as ErrorCorrectionLevel
                      )
                    }
                    className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-200/50 outline-none bg-white/70 backdrop-blur-sm hover:bg-white transition-all"
                  >
                    <option value="L">Low (7%)</option>
                    <option value="M">Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%)</option>
                  </select>
                  <p className="mt-1 text-xs text-slate-600">
                    Higher levels allow more damage tolerance but increase QR
                    size
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 hover:shadow-glow transition-all duration-300">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between text-xl font-semibold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-4"
              >
                <span className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary-600" />
                  Advanced Customization
                </span>
                {showAdvanced ? (
                  <ChevronDown className="w-5 h-5 text-primary-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-primary-500" />
                )}
              </button>

              {showAdvanced && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Foreground Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.fgColor}
                          onChange={(e) =>
                            updateConfig("fgColor", e.target.value)
                          }
                          className="w-12 h-10 rounded-lg cursor-pointer border-2 border-primary-200 hover:border-primary-300 transition-colors"
                        />
                        <input
                          type="text"
                          value={config.fgColor}
                          onChange={(e) =>
                            updateConfig("fgColor", e.target.value)
                          }
                          className="flex-1 px-3 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-200/50 outline-none bg-white/70 hover:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Background Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.bgColor}
                          onChange={(e) =>
                            updateConfig("bgColor", e.target.value)
                          }
                          className="w-12 h-10 rounded-lg cursor-pointer border-2 border-primary-200 hover:border-primary-300 transition-colors"
                        />
                        <input
                          type="text"
                          value={config.bgColor}
                          onChange={(e) =>
                            updateConfig("bgColor", e.target.value)
                          }
                          className="flex-1 px-3 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-200/50 outline-none bg-white/70 hover:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-primary-600" />
                      Center Logo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-primary-50 file:to-accent-50 file:text-primary-700 hover:file:from-primary-100 hover:file:to-accent-100 file:transition-all file:cursor-pointer"
                    />
                    {logoFile && (
                      <div className="mt-4 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Logo Shape
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateConfig("logoShape", "square")
                              }
                              className={`p-3 rounded-lg border-2 transition-all ${
                                config.logoShape === "square"
                                  ? "border-primary-500 bg-primary-50 text-primary-700"
                                  : "border-primary-200 hover:border-primary-300 text-slate-600"
                              }`}
                            >
                              <div className="w-8 h-8 mx-auto bg-current opacity-20"></div>
                              <span className="text-xs mt-1 block">Square</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateConfig("logoShape", "rounded")
                              }
                              className={`p-3 rounded-lg border-2 transition-all ${
                                config.logoShape === "rounded"
                                  ? "border-primary-500 bg-primary-50 text-primary-700"
                                  : "border-primary-200 hover:border-primary-300 text-slate-600"
                              }`}
                            >
                              <div className="w-8 h-8 mx-auto bg-current opacity-20 rounded-lg"></div>
                              <span className="text-xs mt-1 block">
                                Rounded
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateConfig("logoShape", "circle")
                              }
                              className={`p-3 rounded-lg border-2 transition-all ${
                                config.logoShape === "circle"
                                  ? "border-primary-500 bg-primary-50 text-primary-700"
                                  : "border-primary-200 hover:border-primary-300 text-slate-600"
                              }`}
                            >
                              <div className="w-8 h-8 mx-auto bg-current opacity-20 rounded-full"></div>
                              <span className="text-xs mt-1 block">Circle</span>
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Logo Size: {config.logoSize}px
                          </label>
                          <input
                            type="range"
                            min="20"
                            max="100"
                            value={config.logoSize}
                            onChange={(e) =>
                              updateConfig("logoSize", parseInt(e.target.value))
                            }
                            className="w-full h-2 bg-primary-100 rounded-lg appearance-none cursor-pointer accent-primary-600 hover:accent-primary-700"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Logo Opacity: {Math.round(config.logoOpacity * 100)}
                            %
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={config.logoOpacity}
                            onChange={(e) =>
                              updateConfig(
                                "logoOpacity",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full h-2 bg-primary-100 rounded-lg appearance-none cursor-pointer accent-primary-600 hover:accent-primary-700"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 hover:shadow-glow-lg transition-all duration-300">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-6 text-center">
                Preview
              </h2>

              {/* Hidden QR generator for base canvas */}
              <div ref={qrRef} className="hidden">
                <QRCodeCanvas
                  value={config.text}
                  size={config.size}
                  fgColor={config.fgColor}
                  bgColor={config.bgColor}
                  level={config.level}
                  includeMargin={false}
                />
              </div>

              {/* Preview - displays the final composited canvas */}
              <div className="flex justify-center mb-6">
                <div className="rounded-2xl border-2 border-primary-200 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <canvas ref={finalCanvasRef} className="block" />
                </div>
              </div>

              <button
                onClick={downloadQR}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-bold rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl"
              >
                <Download className="w-5 h-5" />
                Download QR Code
              </button>

              <div className="mt-6 p-5 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl border border-primary-200">
                <h3 className="text-sm font-bold text-primary-700 mb-3 flex items-center gap-2">
                  <span className="text-lg">💡</span> Tips:
                </h3>
                <ul className="text-xs text-slate-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-500 font-bold">•</span>
                    <span>Use high error correction when adding logos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-500 font-bold">•</span>
                    <span>Dark foreground on light background works best</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-500 font-bold">•</span>
                    <span>Test your QR code before printing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-500 font-bold">•</span>
                    <span>Larger sizes provide better scan reliability</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-white/80 drop-shadow-md">
          <p className="font-medium">
            Built with React, TypeScript, and Tailwind CSS 4
          </p>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={activeModal === "website"}
        onClose={() => setActiveModal(null)}
        title="Website QR Code"
        icon={<Globe className="h-5 w-5 text-primary-600" />}
        size="md"
      >
        <WebsiteForm onSubmit={handleWebsiteSubmit} />
      </Modal>

      <Modal
        isOpen={activeModal === "email"}
        onClose={() => setActiveModal(null)}
        title="Email QR Code"
        icon={<Mail className="h-5 w-5 text-primary-600" />}
        size="md"
      >
        <EmailForm onSubmit={handleEmailSubmit} />
      </Modal>

      <Modal
        isOpen={activeModal === "phone"}
        onClose={() => setActiveModal(null)}
        title="Phone QR Code"
        icon={<Phone className="h-5 w-5 text-primary-600" />}
        size="md"
      >
        <PhoneForm onSubmit={handlePhoneSubmit} />
      </Modal>

      <Modal
        isOpen={activeModal === "wifi"}
        onClose={() => setActiveModal(null)}
        title="WiFi QR Code"
        icon={<Wifi className="h-5 w-5 text-primary-600" />}
        size="md"
      >
        <WiFiForm onSubmit={handleWiFiSubmit} />
      </Modal>
    </div>
  );
}

export default App;
