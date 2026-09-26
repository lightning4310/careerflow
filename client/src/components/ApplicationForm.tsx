import type { ChangeEvent, SubmitEvent } from "react";

type FormData = {
    company: string;
    role: string;
    location: string;
    jobType: string;
    workMode: string;
    jobLink: string;
    status: string;
    salary: string;
     notes: string;
};

type ApplicationFormProps = {
    formData: FormData;
    editingId: string | null;
    onInputChange: (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => void;
    onSubmit: (e: SubmitEvent<HTMLFormElement>)=> void;
};

function ApplicationForm({
    formData,
    editingId,
    onInputChange,
    onSubmit,
}: ApplicationFormProps) {
    return(
        <form onSubmit={onSubmit} className= "application-form">
        <h2>{editingId ? "Edit Application" : "Add Applicaiton"}</h2>

        <label>Company</label>
        
        <input
        name="company"
        value={formData.company}
        onChange={onInputChange}
        placeholder="e.g. Company Name"
        required
        />

        <label>Job Role</label>
      <input
        name="role"
        value={formData.role}
        onChange={onInputChange}
        placeholder="e.g. Full Stack Developer"
        required
      />

      <label>Location</label>
      <input
        name="location"
        value={formData.location}
        onChange={onInputChange}
        placeholder="e.g. Kochi"
      />

      <label>Job Type</label>
      <select
        name="jobType"
        value={formData.jobType}
        onChange={onInputChange}
      >
        <option value="">Select Job type</option>
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Internship">Internship</option>
        <option value="Contract">Contract</option>
      </select>

      <label>Work Mode</label>
      <select
        name="workMode"
        value={formData.workMode}
        onChange={onInputChange}
      >
        <option value="">Select work mode</option>
        <option value="On-site">On-site</option>
        <option value="Remote">Remote</option>
        <option value="Hybrid">Hybrid</option>
      </select>

      <label>Job Link</label>
      <input
        name="jobLink"
        type="url"
        value={formData.jobLink}
        onChange={onInputChange}
        placeholder="https://..."
      />

      <label>Status</label>
      <select
        name="status"
        value={formData.status}
        onChange={onInputChange}
      >
        <option value="SAVED">Saved</option>
        <option value="APPLIED">Applied</option>
        <option value="ASSESSMENT">Assessment</option>
        <option value="INTERVIEW">Interview</option>
        <option value="OFFER">Offer</option>
        <option value="REJECTED">Rejected</option>
      </select>

      <label>Salary / CTC</label>
      <input
        name="salary"
        type="number"
        min="0"
        value={formData.salary}
        onChange={onInputChange}
        placeholder="Annual salary"
      />

      <label>Notes</label>
      <textarea
        name="notes"
        value={formData.notes}
        onChange={onInputChange}
        placeholder="Additional details..."
      />

      <button type="submit">
        {editingId ? "Update Application" : "Save Application"}
      </button>
        </form>
    );
}

export default ApplicationForm;