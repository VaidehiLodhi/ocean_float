import CesiumWrapper from "./components/CesiumWrapper";

async function getPosition() {
  //Mimic server-side stuff...
  return {
    position: {
      lat: 39.953436,
      lng: -75.164356,
    },
  };
}

export default async function MainPage() {
  const fetchedPosition = await getPosition();
  return <CesiumWrapper positions={[fetchedPosition.position]} />;
}
