export default function DisabledAccountPage(){
    return (
        <div className="min-h-screen flex flex-col sm: max-w-2xl md:max-w-4xl w-full mx-auto items-center text-center pt-16">
            <div className="flex flex-col rounded-box bg-base-200 p-16 gap-5">
                <h1 className="text-4xl">Your account has been disabled.</h1>
                <p>You have limited access to your profile and character exploration. Please check the email address attached to your account for the reason your account may have been disabled.</p>
                <p>If you believe your account may have been disabled <b>in error</b>, please contact our help team.</p>
                <h1 className="text-xl text-right pt-2 sm:pt-10">- CONSTELLATION TEAM</h1>
            </div>
        </div>
    )
}