const Sequelize = require('sequelize');
const db = require('../../models');

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

const fetchAppStoreTopHundredGames = async () => {
  const url = 'https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/ios.top100.json';
  return fetchData(url);
};

const fetchGooglePlayStoreTopHundredGames = async () => {
  const url = 'https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/android.top100.json';
  return fetchData(url);
};

const saveAppsInBulk = async (apps, platform) => {
  const formattedApps = apps.map((app) => ({
    publiesherId: app.app_id,
    name: app.name,
    platform,
    // I stopped here: i needed to format each app to our model in order to save them
    storeid: '',
    bundleId: '',
    appVersion: '',
    isPublished: '',
  }));

  const transaction = await Sequelize.transaction();
  try {
    const savedApps = await db.Game.bulkCreate(formattedApps, { transaction, ignoreDuplicates: true, returning: true });
    await transaction.commit();
    return savedApps;
  } catch (error) {
    await transaction.rollback();
    throw new Error('Save apps in bulk transaction has failed');
  }
};

const populate = async () => {
  const appStoreTopHundredGames = await fetchAppStoreTopHundredGames();
  const googlePlayStoreTopHundredGames = await fetchGooglePlayStoreTopHundredGames();

  appStoreTopHundredGames.splice(100);
  googlePlayStoreTopHundredGames.splice(100);

  const savedAppsInAppStore = await saveAppsInBulk(appStoreTopHundredGames, 'ios');
  const savedAppsInGooglePlayStore = await saveAppsInBulk(googlePlayStoreTopHundredGames, 'android');

  return [...savedAppsInAppStore, ...savedAppsInGooglePlayStore];
};

module.exports = {
  populate,
};
