import galaxyTexture from "../assets/galaxy_texture.jpg";
import BlueGalaxyTexture from "../assets/blue_galaxy_texture.jpg"
import HomeDisplay from "./HomeDisplay";
import { useNavigate } from "react-router-dom";


export default function Home() {

  const navigate = useNavigate();


  return (<>
    <div className="relative mask-[linear-gradient(to_bottom,black_80%,transparent)]">

        {/* LOCAL KEYFRAMES */}
      <style>
        {`
          @keyframes background-pan {
            0%   { background-position: 0% 0%; }
            50%  { background-position: 100% 100%; }
            100% { background-position: 0% 0%; }
          }
        `}
      </style>
    
    {/* blurred background layer */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-xs -z-10"
        style={{
          backgroundImage:
            "url(https://www.maps.com/app/uploads/2025/08/article-stars-northern-sky-featured.webp)",
        }}
      />

    <div
      className="hero min-h-screen"
      
    >
      <div className="hero-overlay"></div>

      <div className="hero-content text-neutral-content text-center ">
        <div className="max-w-6xl">
          <h1
            className="
              mb-5 text-8xl font-bold
              bg-no-repeat
              bg-clip-text text-transparent
              bg-[length:200%_200%]
              drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]
            "
            style={{
              backgroundImage: `url(${BlueGalaxyTexture})`,
              animation: "background-pan 60s linear infinite",
              WebkitTextStroke: "1.0px white",
            }}
          >
            CONSTELLATION
          </h1>

          <p className="
              mb-5 text-2xl
             
            "
            style={{
              
              WebkitTextStroke: "0.25px black",
            }}>
            Welcome to CONSTELLATION, the character managing website! We provide a place to keep track of your characters.
            Upload, edit, and manage your own characters! Favorite other user's characters! Generate a color palette for inspiration!
            We provide multiple services to aid in your character managing and developing experience.
          </p>

          <button className="btn btn-primary hover:scale-105 hover:transition btn-xl sekuya-regular" onClick={() => navigate("/", {replace:true})}>Get Started Today</button>
          
        </div>
      </div>
    </div>
    </div>
    <div className="p-8">
      <h1 className="text-center text-4xl">PREVIEW THE LATEST CHARACTERS ON CONSTELLATION</h1>
      <HomeDisplay />
    </div>
    </>
  );
}
