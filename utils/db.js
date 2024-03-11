import dbClient from './redis';

const waitConnection = () => new Promise((resolve, reject) => {
  let i = 0;
  const repeatFct = async () => {
    await setTimeout(() => {
      i += 1;
      if (i >= 10) {
        reject(new Error('Connection to MongoDB timed out')); // Reject with an error
      } else if (!dbClient.isAlive()) {
        repeatFct();
      } else {
        resolve();
      }
    }, 1000);
  };
  repeatFct();
});

(async () => {
  console.log(dbClient.isAlive());
  try {
    await waitConnection();
    console.log(dbClient.isAlive());
    console.log(await dbClient.nbUsers());
    console.log(await dbClient.nbFiles());
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Terminate the process with a non-zero exit code
  }
})();
