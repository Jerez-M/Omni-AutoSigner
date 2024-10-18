import Profile from "../../components/settings/Profile";
import Security from "../../components/settings/Security";

const SettingsPage = () => {
	return (
		<main className='mx-auto py-6 px-4 lg:px-8'>
			<Profile />
			<Security />
		</main>
	);
};
export default SettingsPage;
