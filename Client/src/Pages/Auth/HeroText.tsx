import { motion } from 'framer-motion';

const TeamPulse = ({ isMobile = false, muiTheme }) => {
    const text = "team-pulse";

    return (
        <>
            <motion.div
                initial={{ scale: 0.9, opacity: 0.5 }} // Start with lower opacity to prevent vanishing
                animate={{
                    scale: [1.5, 1.1, 1.5],
                    opacity: [0.5, 1, 0.5], // Animate opacity without full disappearance
                    transition: {
                        duration: 20,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "mirror",
                    }
                }}
                style={{ display: 'flex', perspective: 2000 }} // Perspective for 3D effect
            >
                {text.split('').map((char, index) => (
                    <motion.div
                        key={index}
                        style={{
                            display: 'inline-block',
                            margin: '0 2px',
                        }}
                        animate={{
                            rotateY: [0, 10, -10, 10, -10, 0], // 3D rotation effect
                            scale: [1, 1.1, 1],
                            textShadow: [
                                "0px 0px 20px rgba(255, 0, 0, 0.7)",   // Vibrant Red
                                "0px 0px 20px rgba(0, 255, 0, 0.7)",   // Vibrant Green
                                "0px 0px 20px rgba(0, 0, 255, 0.7)",   // Vibrant Blue
                                "0px 0px 20px rgba(255, 165, 0, 0.7)", // Vibrant Orange
                                "0px 0px 20px rgba(75, 0, 130, 0.7)",  // Vibrant Indigo
                            ][index % 5],
                            transition: { duration: 2, repeat: Infinity, repeatType: "mirror" }
                        }}
                    >
                        <motion.span
                            style={{
                                display: 'inline-block',
                                fontStyle: 'italic',
                                fontWeight: 700,
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: isMobile ? '50px' : '90px',
                                color: muiTheme.palette.mode === "dark" ? "#fff" : "#000",
                            }}
                        >
                            {char}
                        </motion.span>
                    </motion.div>
                ))}
            </motion.div>
        </>
    );
};

export default TeamPulse;