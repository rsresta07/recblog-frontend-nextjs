import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Group, Text, Image as MantineImage, Modal } from "@mantine/core";
import {ReactNode, useEffect, useState} from "react";
import { Controller } from "react-hook-form";
import { CloudUpload, X } from "lucide-react";
import ImageCropper from "./ImageCropper";
import { uploadImageToCloudinary } from "@/utils/lib/cloudinaryUpload";
import CommonButton from "./CommonButton";

interface CommonImageUploadProps {
  control: any;
  name: string;
  label: ReactNode;
  rules?: any;
  errors: any;
  required?: boolean;
  existingImageUrl?: string | null;
  onImageChange?: (url: string | null) => void;
}

const CommonImageUpload = ({
                             control,
                             name,
                             label,
                             rules,
                             errors,
                             required = false,
                             existingImageUrl = null,
                             onImageChange,
                           }: CommonImageUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(existingImageUrl);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingImageUrl);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | Blob | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const uploadImage = async (croppedBlob: Blob) => {
    try {
      setIsLoading(true);
      setInvalid(false);

      const file = new File([croppedBlob], "cropped-image.png", { type: "image/png" });
      const imageUrl = await uploadImageToCloudinary(file);

      setUploadedImageUrl(imageUrl);
      setPreviewUrl(imageUrl);

      if (onImageChange) onImageChange(imageUrl);
      return imageUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      setInvalid(true);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (croppedImage && croppedImage instanceof Blob) {
      uploadImage(croppedImage);
    }
  }, [croppedImage]);

  const handleRemoveImage = () => {
    setUploadedImageUrl(null);
    setPreviewUrl(null);
    if (onImageChange) onImageChange(null);
  };

  return (
    <div className="w-full">
      <label className="text-sm font-semibold mb-2 block border-none bg-transparent shadow-none px-0">
        {label} {required && <span className="text-destructive">*</span>}
      </label>

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <>
            {previewUrl ? (
              <div className="relative inline-block w-full sm:w-auto bg-background/30 p-2 rounded-3xl border border-border/50">
                <MantineImage
                  src={previewUrl}
                  alt="Preview"
                  radius="xl"
                  onClick={() => setShowModal(true)}
                  className="cursor-pointer hover:opacity-80 transition-opacity w-full sm:w-[250px] object-cover h-[160px]"
                />
                <div className="absolute -top-3 -right-3">
                  <CommonButton
                    label="Remove"
                    variant="filled"
                    color="destructive"
                    size="xs"
                    fullWidth={false}
                    onClick={handleRemoveImage}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-background/30 backdrop-blur-sm border-2 border-dashed border-border/60 rounded-3xl hover:bg-background/50 hover:border-primary/50 transition-all duration-300 overflow-hidden">
                <Dropzone
                  loading={isLoading}
                  onDrop={(files) => {
                    if (files[0]) {
                      setImgSrc(URL.createObjectURL(files[0]));
                      field.onChange(files[0]);
                    }
                  }}
                  onReject={() => setInvalid(true)}
                  accept={IMAGE_MIME_TYPE}
                  maxSize={5 * 1024 * 1024} // 5MB
                  classNames={{ inner: 'pointer-events-none' }}
                  style={{ background: 'transparent', border: 'none' }}
                >
                  <Group
                    style={{ minHeight: 180 }}
                    className="flex flex-col sm:flex-row text-center sm:text-left p-6"
                  >
                    <Dropzone.Accept>
                      <div className="p-4 bg-primary/20 rounded-full"><CloudUpload size={40} className="text-primary" /></div>
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <div className="p-4 bg-destructive/20 rounded-full"><X size={40} className="text-destructive" /></div>
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      <div className="p-4 bg-muted rounded-full"><CloudUpload size={40} className="text-muted-foreground" /></div>
                    </Dropzone.Idle>

                    <div>
                      <Text size="lg" color="var(--foreground)">
                        Drag image here or click to select
                      </Text>
                      <Text size="sm" color="dimmed" mt={4}>
                        Supports PNG, JPG, GIF up to 5MB
                      </Text>
                    </div>
                  </Group>
                </Dropzone>
              </div>
            )}
          </>
        )}
      />

      {errors[name] && <Text color="red" size="xs" mt={8}>{errors[name].message}</Text>}
      {invalid && <Text color="red" size="xs" mt={8}>Invalid image format or upload failed!</Text>}

      <ImageCropper
        imgSrc={imgSrc}
        setCroppedImage={setCroppedImage}
        onClose={() => setImgSrc(null)}
      />

      <Modal
        opened={showModal}
        onClose={() => setShowModal(false)}
        centered
        size="xl"
        title={<span className="font-bold text-primary">Image Preview</span>}
        classNames={{ content: 'rounded-3xl', header: 'border-b border-border/50 pb-4' }}
      >
        {previewUrl && (
          <div className="p-4 bg-background/50 rounded-2xl flex justify-center">
            <MantineImage src={previewUrl} alt="Full size preview" fit="contain" radius="lg" style={{ maxHeight: '60vh' }} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CommonImageUpload;