// == Imports : npm
import { Line  } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import fx from 'money';
import PropTypes from 'prop-types';
// import moment from 'moment/dist/moment';
// import 'moment/dist/locale/fr';

// == Imports : local
// Styles
import './style.scss';

// Functions
import { numberToComma } from '../../selectors/numberToComma';
import { calculateTotalSum } from '../../selectors/calculateTotalSum';
import { calculateProfits } from '../../selectors/calculateProfits';
import { calculateDeposits } from '../../selectors/calculateDeposits';
import { getDates } from '../../selectors/getDates';
import { getDaysArray } from '../../selectors/getDaysArray';

// == Component
const Dashboard = ({ accountsList }) => {
  const loading = useSelector((state) => state.accounts.loading);
  
  // Money converter
  fx.base = 'USD';
  fx.rates = {
    'EUR': 0.88,
    'USD': 1,
  };
  fx.settings = {
    from: 'USD',
    to: 'EUR'
  };
  
  // Total sum of accounts
  const totalWalletValue = calculateTotalSum(accountsList);
  // Convert total usd into eur
  const totalWalletValueConverted = fx.convert(totalWalletValue);

  // Calculation of total percentage of all accounts
  // The variable that will contain the total percentage of all accounts
  let totalPercent = 0;
  // The variable that will contain the sum of benefit of all account
  let totalProfit = 0;
  // The variable that will contain the sum of deposits of all account
  let totalDeposits = 0;

  // The function that calculate all profits from all accounts
  totalProfit = calculateProfits(accountsList);
  // The function that calculate all deposits from all accounts
  totalDeposits = calculateDeposits(accountsList);

  // Calculation of the percentage using the variables 'totalDeposits' and 'totalProfit'
  totalPercent = totalProfit / totalDeposits;

  // Array that contain all dates of all transactions on all of the accounts
  const dates = getDates(accountsList);
  // Sorting dates
  dates.sort();
  // Array that contain all of dates from the first transaction to the last
  const allDates = getDaysArray(dates[0], dates.at(-1));

  // Data for the graph
  const lineData = {
    labels: allDates,
    datasets: [{
      data: [1, 2, 5, 2],
      // backgroundColor: 'linear-gradient(90deg, rgba(0,113,255,1) 0%, rgba(0,113,255,0) 100%);',
      fill: true,
      borderColor: 'rgb(75, 192, 192)',
      // borderWidth: 9,
      pointRadius: 4,
      pointHoverRadius: 7,
      pointBackgroundColor: 'rgb(75, 192, 192)',
      tension: 0.15,
    }],
  }

  // Options for the graph
  const lineOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
      },
    },
  }

  // Loader
  if (loading) {
    return <div>
      Chargement...
    </div>
  }

  // == Render
  return (
    <div className="dashboard">
      <div className="dashboard__wallet">
        <div className="dashboard__wallet__dollars">
          <span className="dashboard__wallet__dollars__tag">Portefeuille</span>
          <span className="dashboard__wallet__dollars__value">${numberToComma(totalWalletValue.toFixed(2))}</span>
          <span className="dashboard__wallet__dollars__converted">{numberToComma(totalWalletValueConverted.toFixed(2))}€</span>
        </div>
        <div className="dashboard__wallet__percentage">
          <span className="dashboard__wallet__percentage__tag">Evolution</span>
          <span className="dashboard__wallet__percentage__value">+{Math.round(totalPercent * 10000) / 100}%</span>
          <span className="dashboard__wallet__percentage__converted">+ ${numberToComma(totalProfit)}</span>
        </div>
      </div>
      <div className="dashboard__transactions">
        <h2 className="dashboard__transactions__title">Derniers mouvements</h2>
        <span>Transaction 1</span>
        <span>Transaction 2</span>
        <span>Transaction 3</span>
        <span>Transaction 4</span>
        <span>Transaction 5</span>
        <span>Transaction 6</span>
      </div>
      <div className="dashboard__graphic">
        <Line data={lineData} options={lineOptions} />
      </div>
    </div>
  );
};

// == Proptypes
Dashboard.propTypes ={
  accountsList: PropTypes.array.isRequired,
}

// == Export
export default Dashboard;
