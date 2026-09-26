import API_BASE_URL from "../config/api";

export const fetchApplications = async (token: string | null) => {
    const response = await fetch(`${API_BASE_URL}/api/applications`,{
        headers: {
            Authorization: `Bearer ${token}`,

    },
});

const data =await response.json();

if(!response.ok){
    throw new Error(data.message || "Failed to fetch applications")
}

return data.applications || [];
}


export const saveApplication = async(
    token: string | null,
    formData: {
    company: string;
    role: string;
    location: string;
    jobType: string;
    workMode: string;
    jobLink: string;
    status: string;
    salary: string;
    notes: string;
    },
    editingId: string | null
)=> {
    const url = editingId
    ?`${API_BASE_URL}/api/applications/${editingId}`
    :`${API_BASE_URL}/api/applications`;

    const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            ...formData,
            salary: formData.salary
            ?Number(formData.salary)
            : undefined,
        }),
    });


    const data = await response.json();

    if(!response.ok)
        throw new Error(data.message || "Failed to create application");
    return data.application;
}