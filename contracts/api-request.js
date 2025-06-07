const bech32Address = args[0];
const hexAddress = args[1];

const apiResponse = await Functions.makeHttpRequest({
  url: `
https://keplr-ideathon.vercel.app/verify?address=${bech32Address}`,
});
if (apiResponse.error) {
  throw Error("Request failed");
}

const { data } = apiResponse;

if (data.hexAddress.toLowerCase() !== hexAddress.toLowerCase()) {
  throw Error("Not matched user");
}

return Functions.encodeString(data.delegationAmount);
