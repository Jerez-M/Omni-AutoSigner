import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileSignature } from 'your-icon-library'; // Adjust the import based on your icon library

const AnimatedText = () => {
    const fullText = "Omni AutoSigner";
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [textIndex, setTextIndex] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isDeleting) {
                setDisplayText(fullText.slice(0, textIndex));
                if (textIndex === 0) {
                    setIsDeleting(false);
                    setTextIndex(1);
                } else {
                    setTextIndex(textIndex - 1);
                }
            } else {
                setDisplayText(fullText.slice(0, textIndex));
                if (textIndex === fullText.length) {
                    setIsDeleting(true);
                } else {
                    setTextIndex(textIndex + 1);
                }
            }
        }, isDeleting ? 100 : 200); // Adjust timing for writing and deleting

        return () => clearTimeout(timer);
    }, [textIndex, isDeleting]);

    return (
        <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-3xl flex font-bold mt-2 text-gray-800"
        >
            {displayText}
            <FileSignature className="text-blue-950 mr-2" size={36} />
        </motion.h1>
    );
};

export default AnimatedText;