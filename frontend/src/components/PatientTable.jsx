import React from "react";

export default function PatientTable({ patients }) {
  return (
    <div className="card">
      <h2>All Patients</h2>

      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Disease</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient._id}>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.disease}</td>
                <td>{patient.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}