import { useNavigation } from "react-router-dom";

function Home() {
  const navigation = useNavigation();

  if (navigation.state === "loading") {
    return (
      <main className="loading-center">
        <div className="loading"></div>
      </main>
    );
  }
}

export default Home;
