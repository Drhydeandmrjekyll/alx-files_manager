import { app } from './app';
import { connect } from './utils/db';

const PORT = process.env.PORT || 5000;

(async () => {
  await connect();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
