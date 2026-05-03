import { useAIStore, LOCAL_MODELS } from "@/stores/aiStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Key, Bot, Download, Cpu, Cloud, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { initEngine, resetEngine } from "@/utils/aiEngine";
import { cn } from "@/lib/utils";

export function AISettings() {
  const store = useAIStore();
  const [showKey, setShowKey] = useState(false);
  const [localKey, setLocalKey] = useState(store.openaiKey);
  const [localModel, setLocalModel] = useState(store.openaiModel);

  const handleSave = () => {
    store.setOpenAIKey(localKey.trim());
    store.setOpenAIModel(localModel.trim());
  };

  const handleLoadLocalModel = async () => {
    try {
      await initEngine();
    } catch {
      // error handled in store
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot size={20} />
          AI Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Provider Toggle */}
        <div className="space-y-2">
          <Label>AI Provider</Label>
          <div className="flex gap-2">
            <button
              onClick={() => {
                store.setProvider("local");
                resetEngine();
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-md border text-sm font-medium transition-colors",
                store.provider === "local"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:bg-muted"
              )}
            >
              <Cpu size={16} /> Local (Embedded)
            </button>
            <button
              onClick={() => {
                store.setProvider("openai");
                resetEngine();
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-md border text-sm font-medium transition-colors",
                store.provider === "openai"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:bg-muted"
              )}
            >
              <Cloud size={16} /> OpenAI API
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {store.provider === "local"
              ? "Runs entirely in your browser. No API key needed. First use downloads the model."
              : "Uses OpenAI's servers. Requires an API key."}
          </p>
        </div>

        <Separator />

        {store.provider === "local" ? (
          <div className="space-y-4">
            <Label>Local Model</Label>
            <div className="space-y-2">
              {LOCAL_MODELS.map((model) => (
                <div
                  key={model.id}
                  className={cn(
                    "border rounded-lg p-3 cursor-pointer transition-colors",
                    store.localModel === model.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted"
                  )}
                  onClick={() => {
                    store.setLocalModel(model.id);
                    resetEngine();
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border flex items-center justify-center",
                          store.localModel === model.id
                            ? "border-primary"
                            : "border-muted-foreground"
                        )}
                      >
                        {store.localModel === model.id && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <span className="font-medium text-sm">{model.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{model.size}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 ml-6">
                    {model.description}
                  </p>
                </div>
              ))}
            </div>

            {store.engineStatus === "downloading" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 size={14} className="animate-spin" />
                  Downloading model... {store.downloadProgress}%
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${store.downloadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {store.engineStatus === "ready" && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle size={14} /> Model ready
              </div>
            )}

            {store.engineStatus === "error" && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle size={14} /> {store.engineError}
              </div>
            )}

            <Button
              onClick={handleLoadLocalModel}
              disabled={store.engineStatus === "downloading"}
              className="w-full gap-1"
            >
              {store.engineStatus === "downloading" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              {store.engineStatus === "ready" ? "Reload Model" : "Download & Load Model"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
              Your API key is stored locally in your browser. It is never sent to our servers —
              API calls go directly from your browser to OpenAI.
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey" className="flex items-center gap-1">
                <Key size={14} /> OpenAI API Key
              </Label>
              <div className="flex gap-2">
                <Input
                  id="apiKey"
                  type={showKey ? "text" : "password"}
                  value={localKey}
                  onChange={(e) => setLocalKey(e.target.value)}
                  placeholder="sk-..."
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowKey(!showKey)}
                  type="button"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={localModel}
                onChange={(e) => setLocalModel(e.target.value)}
                placeholder="gpt-4o-mini"
              />
              <p className="text-xs text-muted-foreground">
                Recommended: gpt-4o-mini (fast & cheap). You can also use gpt-4o.
              </p>
            </div>

            <Button onClick={handleSave} className="w-full">
              Save Settings
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
