import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResident } from "../redux/slices/planetSlice";
import { Resident } from "../types/planets/interfaces";

interface ResidentDetailsProps {
  residentsURL: string[];
}

const ResidentDetails: FC<ResidentDetailsProps> = ({ residentsURL }) => {
  const dispatch = useDispatch();
  const residents = useSelector((state: any) => state.planets.residents);
  const loadingResidents = useSelector(
    (state: any) => state.planets.loadingResidents
  );

  useEffect(() => {
    const fetchResidentsData = async () => {
      // We use Promise.all to wait for all requests to complete
      await Promise.all(
        residentsURL.map((residentUrl: string) => {
          //   @ts-ignore
          return dispatch(fetchResident(residentUrl));
        })
      );
    };

    fetchResidentsData();
  }, [dispatch, residentsURL]);
  return (
    <div>
      <h2>Residents</h2>
      {loadingResidents === "loading" ? (
        <p>Loading residents...</p>
      ) : (
        <div>
          {residents.length > 0 ? (
            <table
              align="center"
              width="100%"
              border={1}
              cellSpacing="0"
              cellPadding="3"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Height</th>
                  <th>Mass</th>
                  <th>Hair color</th>
                  <th>Skin color</th>
                  <th>Eye color</th>
                  <th>Birth year</th>
                  <th>Gender</th>
                </tr>
              </thead>
              <tbody className="sortable">
                {residents.map((resident: Resident, index: number) => (
                  <tr key={`${resident.name}-${index}`}>
                    <td>{resident.name} </td>
                    <td>{resident.height}</td>
                    <td>{resident.mass}</td>
                    <td>{resident.hair_color}</td>
                    <td>{resident.skin_color}</td>
                    <td>{resident.eye_color}</td>
                    <td>{resident.birth_year}</td>
                    <td>{resident.gender}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No residents found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResidentDetails;
