export async function uploadFile(file) {
  const fd = new FormData();

  fd.append("file", file);

  const url = process.env.UPLOAD_WORKER_URL;

  const response = await fetch(
    url,

    {
      method: "POST",

      body: fd,
    },
  );

  return await response.json();
}
