import Profile from "../../components/settings/Profile";
import Security from "../../components/settings/Security";

const SettingsPage = () => {
	return (
		<div className='flex overflow-auto relative z-10 bg-gray-900'>
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
				<Profile />
				<Security />
			</main>
		</div>
	);
};
export default SettingsPage;
