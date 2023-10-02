const express = require("express");
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;

app.use(cors());
app.use(express.json());



app.get("/getBalance", async (req, res) => {
  
  

  const {query} = req;
  let balance = 0 ;
  let tokenName ;
  let address ;
  let chain , chainName ;
  let tokenPriceDollar = 0 ;
  let jsonResponseBal ;
  
 
  address = await query.address;
  tokenName = await query.tokenName ;

  switch (query.chain){
    case '137' : 
    chain = await EvmChain.POLYGON;
    break;
    case '1' : 
    chain = await EvmChain.ETHEREUM;
    break;
    case '56' : 
    chain = await EvmChain.BSC;
    break;
    case '42161' : 
    chain = await EvmChain.ARBITRUM;
    break;
    case '43114' : 
    chain = await EvmChain.AVALANCHE;
    break;

  }

  
  const secResponse = await Moralis.EvmApi.balance.getNativeBalance({
    chain,
    address
  });

   jsonResponseBal = (secResponse.raw.balance / 1e18).toFixed(5);

  const responseOne = await Moralis.EvmApi.token.getWalletTokenBalances({
    address,
    chain,
  });

  const reso = await responseOne.toJSON();

  try {
    if(tokenName == "MATIC" || tokenName == "ETH" || tokenName == "BNB" || tokenName == "AVAX" ){
      return res.status(200).json(jsonResponseBal);

    }
    reso.forEach(token => {
      if (token.symbol === tokenName) {
 
          const balanceq = token.balance;
          const dec = token.decimals ;
          balance = balanceq / (10 ** dec) ;
          balance = balance.toFixed(5)
      }
    });
  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }

  return res.status(200).json(balance);
});

Moralis.start({
  apiKey: 'mfgCO0J0Own4SZizUyT7iZdKyPjm8YqVtMJwh70k9wIJsLpOk27PsQyyEVQfyQIT',
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});
