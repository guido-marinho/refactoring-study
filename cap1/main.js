const invoiceData = require('../cap1/invoices.json');
const playsData = require('../cap1/plays.json');

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;

  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf);

    // print line for this order
    result += `  ${playFor(perf).name}: ${toUSD(amountFor(perf) / 100)} (${
      perf.audience
    } seats)\n`;
    totalAmount += amountFor(perf);
  }

  result += `Amount owed is ${toUSD(totalAmount)}\n`;
  result += `You earned ${volumeCredits} credits\n`;

  return result;

  // primeiro passo: extrair a função de cálculo de preço
  // terceiro passo: remover o parametro play (variavel local) da função amountFor
  function amountFor(aPerformance) {
    let result = 0;

    switch (playFor(aPerformance).type) {
      case 'tragedy':
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case 'comedy':
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`unknown type: ${playFor(aPerformance).type}`);
    }

    return result;
  }

  // quarto passo: extrair a função de cálculo de créditos criando uma sombra para a variável temporária
  function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ('comedy' === playFor(aPerformance).type)
      result += Math.floor(aPerformance.audience / 5);

    return result;
  }

  // segundo passo: remover a variável temporária play e internalizar a função playFor
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  // quinto passo: extrair a função de formatação de moeda e remover a variável temporária format
  function toUSD(aNumber) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(aNumber / 100);
  }
}

console.log(statement(invoiceData, playsData));
