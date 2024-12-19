require('dotenv').config()

const { ETH_FUND_ABI } = require("../abi")
const getMerkleTreeData = require("../utils/getMerkleTreeData")
const wei = require("../utils/wei")
const web3Provider = require("../utils/web3Provider")

module.exports = async (
  fundAddress, 
  amount, 
  fromToken, 
  toToken, 
  minReturn, 
  key, 
  rpc, 
  dexType,
  accountIndex
) => {
  const web3 = web3Provider(key, rpc)
  const amountInWei = await wei.toWeiByDecimalsDetect(fromToken, String(amount), web3)
  const accounts = await web3.eth.getAccounts()
  const from = accounts[accountIndex]
  const contract = new web3.eth.Contract(ETH_FUND_ABI, fundAddress)
  const {
    proof,
    positions
  } = getMerkleTreeData(toToken)

  const additionalData = "0x"
  
  let status = false
  try{
    await contract.methods.trade(
      fromToken,
      amountInWei,
      toToken,
      dexType,
      proof,
      positions,
      additionalData,
      minReturn
    ).send({ from })

    status = true
  }catch(e){
    console.log("Trade error : ", e)
  }

  return status
}
