type ApplicationCardProps = {
  application: any;
  onEdit: (application: any) => void;
  onDelete: (id: string) => void;
onStatusChange:(id:string, status:string)=> void;
};

function ApplicationCard({
    application,
    onEdit,
    onDelete,
    onStatusChange,
}: ApplicationCardProps){
    return(
        <div className="application-card">
            <h3>{application.role}</h3>
            <p>{application.company}</p>

            <p>
                Status:
                <select
                className="status-select"
                value={application.status}
                onChange={(e) =>
                    onStatusChange(application._id, e.target.value)
                }
                >
                    <option value="SAVED">Saved</option>
                    <option value="APPLIED">Applied</option>
                    <option value="ASSESSMENT">Assessment</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </p>

            <p>
                Location: {application.loaction || "Not Specified"}
            </p>

            <button
            type="button"
            onClick={() => onEdit(application)}
            >Edit
            </button>

            <button
            type="button"
            onClick={() => onDelete(application._id)}
            >Delete</button>
        </div>
    )
}

export default ApplicationCard;