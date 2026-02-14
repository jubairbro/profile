import React, { useState, useRef } from 'react';
import { Sparkles, Upload, ArrowRight, Download, Loader2, Image as ImageIcon } from 'lucide-react';
import { editImageWithGemini } from '../services/geminiService';

const AIEditor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError("Image size too large. Please use an image under 4MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedImage(result);
        setMimeType(file.type);
        setResultImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Remove data URL prefix for API
      const base64Data = selectedImage.split(',')[1];
      
      const resultBase64 = await editImageWithGemini(base64Data, mimeType, prompt);
      
      if (resultBase64) {
        setResultImage(`data:image/png;base64,${resultBase64}`);
      } else {
        setError("The AI could not process the image. Please try a different prompt.");
      }
    } catch (err) {
      setError("An error occurred while communicating with Gemini AI.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = 'gemini-edited-image.png';
      link.click();
    }
  };

  return (
    <div className="bg-card-light dark:bg-card-dark border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xl w-full max-w-4xl mx-auto my-10 relative overflow-hidden group">
       {/* Background Decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles size={120} />
      </div>

      <div className="relative z-10">
        <h2 className="text-3xl font-serif font-bold text-primary mb-2 flex items-center gap-2">
          <Sparkles className="animate-pulse" /> AI Magic Studio
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Upload an image and use natural language to edit it with Gemini 2.5 Flash.
          <br/> <span className="text-xs opacity-70">Example: "Make it look like a sketch", "Add sunglasses", "Change background to Mars"</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div 
              className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden ${selectedImage ? 'border-primary' : 'border-gray-300 dark:border-gray-700 hover:border-primary'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedImage ? (
                <img src={selectedImage} alt="Original" className="w-full h-full object-contain p-2" />
              ) : (
                <div className="text-center p-4">
                  <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload image</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
            </div>

            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your edit (e.g., 'Turn this into a cyberpunk city')"
                className="w-full bg-gray-50 dark:bg-black/30 border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 dark:text-gray-200"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!selectedImage || !prompt || isLoading}
              className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                !selectedImage || !prompt || isLoading 
                  ? 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary-light text-white shadow-lg shadow-primary/30 interactive'
              }`}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
              {isLoading ? 'Processing...' : 'Generate Magic'}
            </button>
            
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          {/* Output Section */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl h-96 md:h-auto bg-gray-50 dark:bg-black/20 flex flex-col items-center justify-center relative overflow-hidden">
            {resultImage ? (
              <>
                 <img src={resultImage} alt="AI Result" className="w-full h-full object-contain p-2" />
                 <button 
                  onClick={downloadImage}
                  className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:scale-110 transition-transform interactive"
                  title="Download"
                 >
                   <Download size={20} className="text-primary" />
                 </button>
              </>
            ) : (
              <div className="text-center p-6 opacity-50">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-4">
                     <div className="relative">
                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                     </div>
                     <p className="text-sm font-mono animate-pulse">Gemini is thinking...</p>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="mx-auto h-12 w-12 mb-2" />
                    <p>AI Output will appear here</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIEditor;