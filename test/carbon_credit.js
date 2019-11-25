const truffleAssert = require('truffle-assertions')
const CarbonCredit = artifacts.require("CarbonCredit")

contract('CarbonCredit', function(accounts) {
  var owner
  var token
  var emptyAddress = web3.utils.padLeft(0x0, 40)
  
  beforeEach(async () => {
    owner = accounts[0]
    token = await CarbonCredit.new("ABC Token", "ABC")
  })

  it('should have the expected state on deployment', async () => {
    assert.equal(await token.owner(), owner)
    assert.equal(await token.totalSupply(), 0)
    assert.equal(await token.balanceOf(owner), 0)
    assert.equal(await token.symbol(), "ABC")
    assert.equal(await token.name(), "ABC Token")
    assert.equal(await token.decimals(), 18)
  })

  it('can depositCarbonCreditsFromCertificate', async () => {
    let ipfsCarbonCertificateHash = "QmcFULbtwMYLwe2cUdUvvWNQVcRsqKCVgFbaUGgseJcpsa"
    let tx = await token.depositCarbonCreditsFromCertificate(100, ipfsCarbonCertificateHash)

    truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
      assert.equal(ev.from, emptyAddress)
      assert.equal(ev.to, owner)
      assert.equal(ev.value, 100)
      return true
    })
    
    truffleAssert.eventEmitted(tx, 'DepositCarbonCreditsFromCertificate', (ev) => {
      assert.equal(ev.ifpsHashOfCarbonCreditCertificate, ipfsCarbonCertificateHash)
      assert.equal(ev.value, 100)
      assert.equal(ev.approvedBy, owner)
      return true
    })

    assert.equal(await token.totalSupply(),100)
    assert.equal(await token.balanceOf(owner), 100)
  })
})
