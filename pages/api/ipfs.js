// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export async function uploadImg() {
  // moved img uploading logic to here
  try {
    const added = await client.add(img, {
      progress: (prog) => console.log(`received: ${prog}`),
    });
    //image url
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    return url;
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
}

export async function uploadToIPFS(fileUrl) {
  const { name, description, price } = formInput;
  if (!name || !description || !price || !fileUrl) return;
  /* first, upload metadata to IPFS */
  const data = JSON.stringify({
    name,
    description,
    image: fileUrl,
  });
  try {
    const added = await client.add(data);
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
    return url;
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
}
