import { connect, getClient } from './utils/db';

const waitConnection = () => {
    return new Promise((resolve, reject) => {
        let i = 0;
        const repeatFct = async () => {
            setTimeout(async () => {
                i += 1;
                if (i >= 10) {
                    reject(new Error('Connection timeout'));
                } else if (!getClient().isConnected()) {
                    await repeatFct();
                } else {
                    resolve();
                }
            }, 1000);
        };
        repeatFct();
    });
};

(async () => {
    await connect();
    console.log('Connected to MongoDB');
    await waitConnection();
    console.log('Database connection is active');
    console.log(dbClient.isAlive());
    onsole.log(await getClient().nbUsers());
    console.log(await getClient().nbFiles());
})();

