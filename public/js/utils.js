//Team-Nuvs
var EdABI = [{
            "inputs": [{
                    "internalType": "uint256",
                    "name": "_qID",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "mem",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "ansedWithdrawl",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "uint256",
                "name": "bounty",
                "type": "uint256"
            }],
            "name": "listQuestion",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [{
                "indexed": true,
                "internalType": "uint256",
                "name": "qId",
                "type": "uint256"
            }],
            "name": "NewQuestion",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getContractBalance",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "qId",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "name": "questions",
            "outputs": [{
                    "internalType": "uint256",
                    "name": "bounty",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "pAnsed",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "eAnsed",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
    // const Web3 = require('web3')

let metamaskWeb3 = new Web3('http://localhost:8545')
    //let metamaskWeb3 = new Web3('https://rpc-mumbai.matic.today')
let account = null
let edlanceContract
let edlanceContractAddress = '0xa25498D3C8122Ae6Ac4257B1c32ef424F3C02917' // Paste Contract address here

function web3() {
    return metamaskWeb3
}

const accountAddress = () => {
    return account
}

async function setProvider() {
    // TODO: get injected Metamask Object and create Web3 instance
    if (window.ethereum) {
        metamaskWeb3 = new Web3(ethereum)
        try {
            // Request account access if needed
            await ethereum.enable()
        } catch (error) {
            // User denied account access...
        }
    } else if (window.web3) {
        metamaskWeb3 = new Web3(web3.currentProvider)
    }
    account = await metamaskWeb3.eth.getAccounts()

}


function getEdlanceContract() {
    // TODO: create and return contract Object
    edlanceContract = edlanceContract || new metamaskWeb3.eth.Contract(EdABI, edlanceContractAddress)
    return edlanceContract
}

async function fetchAllQuestions() {
    // TODO: call Airbnb.propertyId

    const qId = await getEdlanceContract()
        .methods.qId()
        .call()
        // iterate till property Id
    const questions = []
    for (let i = 0; i < qId; i++) {
        const p = await edlanceContract.methods.questions(i).call()
        questions.push({
            id: i,
            bounty: p.bounty,
            pAnsed: p.pAnsed,
            eAnsed: p.eAnsed,
        })
    }
    return questions
        // push each object to properties array
}


async function postQuestion(bounty) {
    /*const prop = await getSanskritiContract()
    .methods.buyProduct(pId, quantity, pmode)
    .send({
      from: account[0],
      value: totalPrice,
    })*/
    const prop = await getEdlanceContract()
        .methods.listQuestion(bounty)
        .send({
            from: account[0],
            value: bounty,
        })

    console.log('Question Paid For Successfully');
}

async function ansedWithdraw(qID, mem, amount) {

    const prop = await getEdlanceContract().
    methods.ansedWithdrawl(qID, mem, amount).
    send({
        from: account[0],
    })
    alert('Answer Posted Successfully !');
}



// async function buyProduct(pId, quantity, totalPrice, pmode) {
//   // TODO: call Airbnb.rentSpace
//   if(pmode == "t"){
//     //web3().utils.toWei(this.propData.price, 'ether')
//     const pay = Math.round((totalPrice/134017)*Math.pow(10,7))/Math.pow(10,7)
//     totalPrice = (metamaskWeb3.utils.toWei(pay.toString(), 'ether'))
//     console.log(totalPrice);
//     const prop = await getSanskritiContract()
//     .methods.buyProduct(pId, quantity, pmode)
//     .send({
//       from: account[0],
//       value: totalPrice,
//     })
//     alert('Product Bought Successfully')

//     }
//   if(pmode == "f"){
//     const prop = await getSanskritiContract()
//     .methods.buyProduct(pId, quantity, pmode)
//     .send({
//       from: account[0],
//     })
//     alert('Product Booked Successfully pay '+totalPrice+' to the given UPI ID')
//     window.location.href="http://localhost:5000/payINR?amt="+totalPrice;
//     }
//   }



// async function markProduct(pId){
//   const prop = await getSanskritiContract()
//   .methods.markProduct(pId)
//   .send({
//     from: account[0],
//   })
//}