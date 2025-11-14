import 'dotenv/config';

async function testDbOperations() {
    console.log('Running test database operations...');
    console.log('file : ' + process.env.DATABASE_URL);
}

testDbOperations();
