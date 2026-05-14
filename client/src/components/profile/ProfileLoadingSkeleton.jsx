/**
 * Creates a skeleton of the profile using daisyUI's skeleton components. 
 * 
 * @author Created using Claude.
 */
export default function ProfileLoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center p-24">
      <div className="flex flex-col bg-base-200 rounded-lg items-center p-16 gap-2 shadow-2xl w-full max-w-4xl">
        
        {/* Avatar */}
        <div className="skeleton rounded-full w-50 h-50" />
        
        {/* Display name */}
        <div className="skeleton h-9 w-48 rounded" />
        
        {/* @username */}
        <div className="skeleton h-4 w-32 rounded" />
        
        {/* Joined date */}
        <div className="skeleton h-5 w-44 rounded" />

        {/* Bio */}
        <div className="skeleton h-6 w-16 rounded mt-6" />
        <div className="skeleton h-4 w-64 rounded" />

      </div>
    </div>
  )
}