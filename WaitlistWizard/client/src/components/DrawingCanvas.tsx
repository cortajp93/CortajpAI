import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";

interface DrawingCanvasProps {
  imageUrl: string;
  onMaskChange: (maskData: string) => void;
}

export function DrawingCanvas({ imageUrl, onMaskChange }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setContext(ctx);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Load and draw the image
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      // Set canvas size to match image
      canvas.width = image.width;
      canvas.height = image.height;

      // Calculate scale factors
      const displayWidth = canvas.offsetWidth;
      const displayHeight = canvas.offsetHeight;
      setScale({
        x: image.width / displayWidth,
        y: image.height / displayHeight,
      });

      ctx.drawImage(image, 0, 0);
    };
  }, [imageUrl]);

  const getScaledCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context) return;
    setIsDrawing(true);

    const { x, y } = getScaledCoordinates(e);
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvasRef.current) return;

    const { x, y } = getScaledCoordinates(e);

    context.lineWidth = brushSize * scale.x; // Scale brush size
    context.strokeStyle = "white";
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing || !context) return;
    setIsDrawing(false);
    context.closePath();

    // Get mask data
    const maskData = canvasRef.current?.toDataURL() || "";
    onMaskChange(maskData);
  };

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;

    // Redraw original image
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      if (!context || !canvasRef.current) return;
      canvasRef.current.width = image.width;
      canvasRef.current.height = image.height;
      context.drawImage(image, 0, 0);
      onMaskChange("");
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <label className="text-sm font-medium">Brush Size</label>
          <Slider
            value={[brushSize]}
            onValueChange={(value) => setBrushSize(value[0])}
            min={1}
            max={50}
            step={1}
            className="w-full"
          />
        </div>
        <Button onClick={clearCanvas} variant="outline">
          Clear Mask
        </Button>
      </div>

      <div className="relative border rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{
            cursor: 'crosshair',
            width: '100%',
            height: 'auto',
            maxHeight: '600px',
            objectFit: 'contain'
          }}
        />
      </div>

      <p className="text-sm text-muted-foreground">
        Draw on the image to create a mask for inpainting
      </p>
    </div>
  );
}