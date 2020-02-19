const main = require('./main');
const { connect } = main; 

it('[Main] Entry point', () => 
{
	desc('Testing application', () => 
	{
		connect();
	});
});
