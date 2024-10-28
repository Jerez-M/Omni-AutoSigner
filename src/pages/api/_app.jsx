// _app.jsx
import '../styles/globals.css';
import { CanvasProvider } from '../context/CanvasContext';
import Header from '../components/Header';

function MyApp({ Component, pageProps }) {
    return (
        <CanvasProvider>
            <Header />
            <Component {...pageProps} />
        </CanvasProvider>
    );
}

export default MyApp;
