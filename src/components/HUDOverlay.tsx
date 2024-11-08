'use client';
import React, {useState, useEffect, useCallback, Suspense} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import Particles from "react-particles"
import {loadSlim} from "tsparticles-slim"
import type {Engine} from "tsparticles-engine"
import {Canvas} from '@react-three/fiber'
import {OrbitControls} from '@react-three/drei'
import {LoadingScreen} from "@/components/LoadingScreen";
import {useBranchInfoContext} from "@/hooks/BranchInfoHook";
import {useRouter} from "next/navigation";
// import Globe from './Globe'

const Logo: React.FC = () => (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="25" cy="25" r="20" stroke="#FF3D00" strokeWidth="2"/>
        <path d="M25 15V35M15 25H35" stroke="#FF3D00" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="25" cy="25" r="5" fill="#FF3D00"/>
    </svg>
)

const GlobeLoading: React.FC = () => (
    <div className="h-[500px] w-full flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-lg">
        <div className="text-white text-2xl font-bold">
            <div className="animate-pulse">Loading Global Network...</div>
            <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        </div>
    </div>
)

const LoginPage: React.FC<{ onLogin: () => void }> = ({onLogin}) => {
    const {branch} = useBranchInfoContext()
    const {push} = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
             style={{backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')"}}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="text-white">
                        <h1 className="text-4xl font-bold mb-4">Welcome to PHOENIX</h1>
                        <span className={'text-md'}> {branch === "UPK" ? "Branch: Up-Park Camp" : ""}</span>
                        <p className="text-xl mb-4">Your Powerful Holographic Operating Ecosystem Navigating Intelligent
                            eXperiences</p>
                    </div>
                    <Card className="glassmorphism w-full max-w-md">
                        <CardHeader className="flex flex-col items-center">
                            <Logo/>
                            <CardTitle
                                className="text-2xl font-bold mt-4 text-white">{branch ? "Configure Kiosk" : "Login to PHOENIX"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!branch ? <Button className="w-full glassmorphism-button" type="button"
                                               onClick={() => push('/branch?kiosk-branch-data=eyJraW9zayI6IlNHS0lPU0stMDAxIiwiYnJhbmNoIjoiVVBLIn0')}>
                                    Register
                                </Button> :
                                <form className="space-y-4" onSubmit={(e) => {
                                    e.preventDefault();
                                    onLogin();
                                }}>
                                    <div>
                                        <label htmlFor="email"
                                               className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                        <Input id="email" type="email" placeholder="Enter your email"/>
                                    </div>
                                    <div>
                                        <label htmlFor="password"
                                               className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                                        <Input id="password" type="password" placeholder="Enter your password"/>
                                    </div>
                                    <Button className="w-full glassmorphism-button" type="submit">
                                        Log In
                                    </Button>
                                </form>}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

const HUDOverlay: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const [contentReady, setContentReady] = useState(false)
    const [scrollbarReady, setScrollbarReady] = useState(false)
    const [currentSection, setCurrentSection] = useState('home')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const {branch} = useBranchInfoContext();

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
            // Add a small delay before showing content to ensure smooth transition
            setTimeout(() => setContentReady(true), 100)
            // Add a longer delay for the scrollbar animation
            setTimeout(() => setScrollbarReady(true), 1000)
        }, 3000)

        return () => clearTimeout(timer)
    }, [])

    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine)
    }, [])

    const particlesLoaded = useCallback(async (container: any) => {
        console.log(container)
    }, [])

    const particlesOptions = {
        particles: {
            number: {value: 100, density: {enable: true, value_area: 800}},
            color: {value: "#ffffff"},
            shape: {type: "circle"},
            opacity: {value: 0.5, random: true, anim: {enable: true, speed: 1, opacity_min: 0.1, sync: false}},
            size: {value: 3, random: true, anim: {enable: false, speed: 40, size_min: 0.1, sync: false}},
            line_linked: {enable: false},
            move: {
                enable: true,
                speed: 0.5,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {onhover: {enable: false}, onclick: {enable: false}, resize: true}
        },
        retina_detect: true
    }

    const renderContent = () => {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSection}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -20}}
                    transition={{duration: 0.5}}
                >
                    {(() => {
                        switch (currentSection) {
                            case 'home':
                                return (
                                    <>
                                        <section className="mb-16">
                                            <h1 className="text-5xl font-bold mb-4 text-white text-shadow-lg">Welcome to
                                                PHOENIX</h1>
                                            <p className="text-xl mb-8 text-white text-shadow-md">Your Powerful
                                                Holographic Operating Ecosystem Navigating Intelligent eXperiences</p>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                                <Card className="glassmorphism">
                                                    <CardHeader>
                                                        <CardTitle className="text-white">Adaptive Learning</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="text-gray-200">
                                                        <p>PHOENIX evolves with you, constantly improving its
                                                            capabilities.</p>
                                                    </CardContent>
                                                </Card>
                                                <Card className="glassmorphism">
                                                    <CardHeader>
                                                        <CardTitle className="text-white">Holographic
                                                            Interface</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="text-gray-200">
                                                        <p>Interact with PHOENIX through cutting-edge holographic
                                                            projections.</p>
                                                    </CardContent>
                                                </Card>
                                                <Card className="glassmorphism">
                                                    <CardHeader>
                                                        <CardTitle className="text-white">Quantum Processing</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="text-gray-200">
                                                        <p>Harness the power of quantum computing for unparalleled
                                                            performance.</p>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                            <Button className="glassmorphism-button"
                                                    onClick={() => setCurrentSection('features')}>
                                                Explore Features
                                            </Button>
                                        </section>
                                        <section className="mt-16 h-[600px] w-full">
                                            <h2 className="text-3xl font-bold mb-4 text-white text-shadow-lg">Global
                                                Network</h2>
                                            <div className="h-[500px] w-full">
                                                <Suspense fallback={<GlobeLoading/>}>
                                                    <Canvas>
                                                        <OrbitControls enableZoom={false} enablePan={false}/>
                                                        <ambientLight intensity={0.5}/>
                                                        <pointLight position={[10, 10, 10]}/>
                                                        {/*<Globe />*/}
                                                    </Canvas>
                                                </Suspense>
                                            </div>
                                        </section>
                                    </>
                                )
                            case 'features':
                                return (
                                    <>
                                        <h2 className="text-3xl font-bold mb-6 text-white text-shadow-lg">PHOENIX
                                            Features</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                            <Card className="glassmorphism">
                                                <CardHeader>
                                                    <CardTitle className="text-white">AI Assistance</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-gray-200">
                                                    <p>Get real-time AI-powered insights and recommendations.</p>
                                                </CardContent>
                                            </Card>
                                            <Card className="glassmorphism">
                                                <CardHeader>
                                                    <CardTitle className="text-white">Environmental Scanning</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-gray-200">
                                                    <p>Analyze your surroundings for potential hazards or points of
                                                        interest.</p>
                                                </CardContent>
                                            </Card>
                                            <Card className="glassmorphism">
                                                <CardHeader>
                                                    <CardTitle className="text-white">Biometric Monitoring</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-gray-200">
                                                    <p>Track your vital signs and physical performance in real-time.</p>
                                                </CardContent>
                                            </Card>
                                            <Card className="glassmorphism">
                                                <CardHeader>
                                                    <CardTitle className="text-white">Augmented Reality
                                                        Overlay</CardTitle>
                                                </CardHeader>
                                                <CardContent className="text-gray-200">
                                                    <p>See relevant information overlaid on your real-world view.</p>
                                                </CardContent>
                                            </Card>
                                        </div>
                                        <Button className="glassmorphism-button"
                                                onClick={() => setCurrentSection('home')}>
                                            Back to Home
                                        </Button>
                                    </>
                                )
                            case 'about':
                                return (
                                    <>
                                        <h2 className="text-3xl font-bold mb-6 text-white text-shadow-lg">About
                                            PHOENIX</h2>
                                        <Card className="glassmorphism">
                                            <CardContent className="mt-6 text-gray-200">
                                                <p className="mb-4">
                                                    PHOENIX (Powerful Holographic Operating Ecosystem Navigating
                                                    Intelligent eXperiences) is a cutting-edge AI assistant designed to
                                                    revolutionize the way you interact with technology.
                                                </p>
                                                <p className="mb-4">
                                                    Inspired by the mythical phoenix, our AI is constantly evolving,
                                                    learning, and improving. Just as the phoenix rises from its ashes,
                                                    PHOENIX adapts and grows with each interaction, providing you with
                                                    an ever-improving user experience.
                                                </p>
                                                <p>
                                                    Our team of expert developers and AI researchers are dedicated to
                                                    pushing the boundaries of what's possible in artificial intelligence
                                                    and human-computer interaction.
                                                </p>
                                            </CardContent>
                                        </Card>
                                        <Button className="glassmorphism-button mt-6"
                                                onClick={() => setCurrentSection('home')}>
                                            Back to Home
                                        </Button>
                                    </>
                                )
                            case 'contact':
                                return (
                                    <>
                                        <h2 className="text-3xl font-bold mb-6 text-white text-shadow-lg">Contact
                                            Us</h2>
                                        <Card className="glassmorphism">
                                            <CardContent>
                                                <form className="space-y-4 mt-6">
                                                    <div>
                                                        <label htmlFor="name"
                                                               className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                                        <Input id="name" placeholder="Your name"/>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="email"
                                                               className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                                        <Input id="email" type="email" placeholder="Your email"/>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="message"
                                                               className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                                                        <textarea
                                                            id="message"
                                                            rows={4}
                                                            className="w-full px-3 py-2 text-gray-300 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Your message"
                                                        ></textarea>
                                                    </div>
                                                    <Button className="glassmorphism-button" type="submit">Send
                                                        Message</Button>
                                                </form>
                                            </CardContent>
                                        </Card>
                                        <Button className="glassmorphism-button mt-6"
                                                onClick={() => setCurrentSection('home')}>
                                            Back to Home
                                        </Button>
                                    </>
                                )
                            default:
                                return null
                        }
                    })()}
                </motion.div>
            </AnimatePresence>
        )
    }

    if (loading) {
        return <LoadingScreen/>
    }

    if (!isLoggedIn) {
        return <LoginPage onLogin={() => setIsLoggedIn(true)}/>
    }

    return (
        <div className="fixed inset-0 pointer-events-none bg-cover  bg-center"
             style={{backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')"}}>
            <Particles
                id="tsparticles"
                init={particlesInit}
                loaded={particlesLoaded}
                options={particlesOptions}
                className="absolute inset-0"
            />
            <motion.div
                className="pointer-events-auto h-full flex flex-col bg-black bg-opacity-40 text-white p-6 overflow-auto relative z-10 custom-scrollbar"
                initial={{opacity: 0}}
                animate={{opacity: contentReady ? 1 : 0}}
                transition={{duration: 0.5}}
            >
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <Logo/>
                        <div className={'flex flex-col'}>
                            <span className="ml-2 text-2xl font-bold">PHOENIX</span>
                            <span className={'text-xs ml-2'}>{branch === "UPK" ? "Branch: Up-Park Camp" : ""}</span>
                        </div>
                    </div>
                    <nav>
                        <ul className="flex space-x-4">
                            <li><Button className="glassmorphism-button" variant="ghost"
                                        onClick={() => setCurrentSection('home')}>Home</Button></li>
                            <li><Button className="glassmorphism-button" variant="ghost"
                                        onClick={() => setCurrentSection('features')}>Features</Button></li>
                            <li><Button className="glassmorphism-button" variant="ghost"
                                        onClick={() => setCurrentSection('about')}>About</Button></li>
                            <li><Button className="glassmorphism-button" variant="ghost"
                                        onClick={() => setCurrentSection('contact')}>Contact</Button></li>
                        </ul>
                    </nav>
                </header>
                <main className="flex-grow">
                    {renderContent()}
                </main>
                <footer className="mt-8 text-center text-sm text-gray-400">
                    © {new Date().getFullYear()} PHOENIX HUD Overlay. All rights reserved.
                </footer>
            </motion.div>

            <style jsx global>{`
                .glassmorphism {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                }

                .glassmorphism-button {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    transition: background-color 0.3s;
                }

                .glassmorphism-button:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .text-shadow-lg {
                    text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                }

                .text-shadow-md {
                    text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                }

                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255, 255, 255, 0.3) rgba(0, 0, 0, 0.1);
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.1);
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.3);
                    border-radius: 4px;
                    border: 2px solid rgba(0, 0, 0, 0.1);
                }

                @keyframes fadeInScrollbar {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    animation: fadeInScrollbar 0.5s ease-in-out;
                    animation-fill-mode: both;
                    animation-delay: ${scrollbarReady ? '0s' : '1s'};
                }
            `}</style>
        </div>
    )
}

export default HUDOverlay