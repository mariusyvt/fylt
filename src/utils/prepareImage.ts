import imageCompression from "browser-image-compression";

const TARGET_TYPE = "image/webp";

const HEIC_BRANDS = ["heic", "heix", "hevc", "heim", "heis", "hevm", "hevs", "mif1", "msf1"];

export const isAcceptedImage = (file: File): boolean =>
    file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name);

const renameExt = (name: string, ext: string): string => {
    const dotIndex = name.lastIndexOf(".");
    const base = dotIndex > 0 ? name.slice(0, dotIndex) : name;
    return `${base}.${ext}`;
};

const isHeic = async (file: File): Promise<boolean> => {
    if (/image\/hei(c|f)/i.test(file.type)) return true;
    if (/\.(heic|heif)$/i.test(file.name)) return true;
    try {
        const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
        const brand = String.fromCharCode(...header.slice(8, 12)).toLowerCase();
        return HEIC_BRANDS.includes(brand);
    } catch {
        return false;
    }
};

const convertHeicToJpeg = async (file: File): Promise<File> => {
    const { default: heic2any } = await import("heic2any");
    const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
    const blob = Array.isArray(converted) ? converted[0] : converted;
    return new File([blob], renameExt(file.name, "jpg"), {
        type: "image/jpeg",
        lastModified: Date.now(),
    });
};

export const prepareImage = async (file: File): Promise<File> => {
    try {
        const source = (await isHeic(file)) ? await convertHeicToJpeg(file) : file;

        const compressed = await imageCompression(source, {
            maxWidthOrHeight: 1600,
            maxSizeMB: 0.5,
            useWebWorker: true,
            fileType: TARGET_TYPE,
            initialQuality: 0.8,
        });

        return new File([compressed], renameExt(file.name, "webp"), {
            type: TARGET_TYPE,
            lastModified: Date.now(),
        });
    } catch (error) {
        console.warn("prepareImage: préparation échouée, envoi du fichier original", error);
        return file;
    }
};
