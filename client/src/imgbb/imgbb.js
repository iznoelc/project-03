const imgbbAPI = import.meta.env.VITE_IMGBB_API_KEY;

const toBase64 = file => new Promise((resolve, reject) => {
   const reader = new FileReader();
   reader.onload = () => resolve(reader.result.split(",")[1]);
   reader.onerror = reject; 

   reader.readAsDataURL(file);
});

export default async function uploadToImgBB(file){
    const formData = new FormData();
    const base64Pfp = await toBase64(file);
    formData.append("image", base64Pfp);

    const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPI}`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!imgRes.ok){
        throw new Error("[IMGBB UPLOAD FAILED");
    }

    const data = await imgRes.json()
    return data.data.url;
}