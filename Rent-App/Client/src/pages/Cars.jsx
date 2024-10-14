import {
  useLoaderData,
  Link,
  Form,
  useSearchParams,
  useNavigate,
  useNavigation,
} from "react-router-dom";

import axios from "axios";

const allCars = "http://localhost:5000/api/v1/images";

export const loader = async () => {
  try {
    const response = await axios.get(allCars);
    return response.data.allImages;
  } catch (error) {
    console.error("Erreur dans le loader :", error);
    throw new Error(
      "Impossible de charger le contenu. Veuillez réessayer plus tard"
    );
  }
};

function Cars() {
  const data = useLoaderData();
  const navigation = useNavigation();

  if (navigation.state === "loading") {
    return (
      <main className="loading-center">
        <div className="loading"></div>
      </main>
    );
  }

  return (
    <>
      {data.map((car) => (
        <div key={car._id}>
          <img
            src={car.url}
            alt={`${car.brand} ${car.model}`}
            className="cars-card"
          />
        </div>
      ))}
    </>
  );
}

export default Cars;
