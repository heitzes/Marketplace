export async function createVoucher(tokenId, uri, minPrice = 0, seller) {
  const voucher = { tokenId, uri, minPrice };
  const domain = {
    name: "LazyNFT-Voucher",
    version: "1",
    verifyingContract: marketplaceAddress,
    chainId: 3,
  };
  const types = {
    NFTVoucher: [
      { name: "tokenId", type: "uint256" },
      { name: "minPrice", type: "uint256" },
      { name: "uri", type: "string" },
    ],
  };

  try {
    const signature = await seller._signTypedData(domain, types, voucher);
    return signature;
  } catch (err) {
    return false;
  }
}

export 