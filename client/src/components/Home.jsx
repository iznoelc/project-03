import galaxyTexture from "../assets/galaxy_texture.jpg";
import HomeDisplay from "./HomeDisplay";
import { Link } from "react-router-dom";


export default function Home() {

    


  return (
    <div
    style={{
        backgroundImage:
          "url(https://www.maps.com/app/uploads/2025/08/article-stars-northern-sky-featured.webp)",
      }}>

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
    
    

    <div
      className="hero min-h-screen"
      
    >
      <div className="hero-overlay"></div>

      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">

          <h1
            className="
              mb-5 text-5xl font-bold
              bg-no-repeat
              bg-clip-text text-transparent
              bg-[length:200%_200%]
              drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]
            "
            style={{
              backgroundImage: `url(${galaxyTexture})`,
              animation: "background-pan 60s linear infinite",
              WebkitTextStroke: "1.0px white",
            }}
          >
            Constellations
          </h1>

          <p className="
              mb-5 text-1xl font-bold
             
            "
            style={{
              
              WebkitTextStroke: "0.25px white",
            }}>
            Welcome to Constellations, we seek to allow people to share characters they have created,
            while also allowing users to explore others characters and find inspiration
            from the many characters and tools we host
          </p>

          <Link to={`/explore`} className="btn btn-primary">Explore</Link>
          
        </div>
        
      </div>
      
    </div>
    <HomeDisplay></HomeDisplay>

            
    </div>
  );
}
