"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { prepareImage } from "@/utils/prepareImage";
import { uploadRecipeImage } from "@/api/services/recipes.service";

export interface UseImageUpload {
    photo: File | null;
    photoUrl: string | null;
    previewUrl: string | null;
    uploading: boolean;
    uploadError: string | null;
    selectImage: (file: File | null) => Promise<void>;
    clearImage: () => void;
    setInitialPhotoUrl: (url: string | null) => void;
}

export const useImageUpload = (): UseImageUpload => {
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const localPreviewRef = useRef<string | null>(null);
    const requestIdRef = useRef(0);

    const revokeLocalPreview = useCallback(() => {
        if (localPreviewRef.current) {
            URL.revokeObjectURL(localPreviewRef.current);
            localPreviewRef.current = null;
        }
    }, []);

    useEffect(() => () => revokeLocalPreview(), [revokeLocalPreview]);

    const selectImage = useCallback(
        async (file: File | null) => {
            setUploadError(null);
            if (!file) return;

            const requestId = ++requestIdRef.current;
            revokeLocalPreview();
            const localPreview = URL.createObjectURL(file);
            localPreviewRef.current = localPreview;

            setPhoto(file);
            setPreviewUrl(localPreview);
            setUploading(true);

            try {
                const prepared = await prepareImage(file);
                const { photo_url } = await uploadRecipeImage(prepared);
                if (requestId !== requestIdRef.current) return;
                setPhotoUrl(photo_url);
            } catch (error) {
                if (requestId !== requestIdRef.current) return;
                const message = (error as Error)?.message;
                setUploadError(message || "Échec de l'envoi de l'image. Réessayez.");
                setPhoto(null);
                setPhotoUrl(null);
                setPreviewUrl(null);
                revokeLocalPreview();
            } finally {
                if (requestId === requestIdRef.current) setUploading(false);
            }
        },
        [revokeLocalPreview]
    );

    const clearImage = useCallback(() => {
        requestIdRef.current++;
        revokeLocalPreview();
        setPhoto(null);
        setPhotoUrl(null);
        setPreviewUrl(null);
        setUploadError(null);
        setUploading(false);
    }, [revokeLocalPreview]);

    const setInitialPhotoUrl = useCallback((url: string | null) => {
        setPhotoUrl(url);
    }, []);

    return {
        photo,
        photoUrl,
        previewUrl,
        uploading,
        uploadError,
        selectImage,
        clearImage,
        setInitialPhotoUrl,
    };
};
