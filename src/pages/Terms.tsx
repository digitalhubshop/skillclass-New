import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-orange-500">🎓 SkillClass</Link>
          <Link to="/" className="px-4 py-2 text-orange-500 border border-orange-200 rounded-lg hover:bg-orange-50">
            Home
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Terms & Conditions</h1>
          <p className="text-gray-500 mb-8">Last updated: September 2026</p>

          <div className="space-y-8 text-gray-600">
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">1. SkillClass के बारे में</h2>
              <p>SkillClass एक All India Online Skill Learning Platform है जहाँ Teachers अपनी Skills सिखा सकते हैं, Students नई Skills सीख सकते हैं, और Sellers Digital Books बेच सकते हैं।</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">2. Account Registration</h2>
              <p>Platform पर register करते समय आप सही और accurate information देने के लिए agree करते हैं। गलत information देने पर account suspend किया जा सकता है।</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">3. Teacher Guidelines</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Teacher अपनी Skill से related classes बना सकते हैं।</li>
                <li>Content original और copyright-free होना चाहिए।</li>
                <li>Misleading information या fake credentials use करना prohibited है।</li>
                <li>Admin approval के बाद ही classroom activate होगा।</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">4. Student Guidelines</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Payment करने के बाद class access मिलेगा।</li>
                <li>Class content को share या redistribute नहीं कर सकते।</li>
                <li>Respectful behavior maintain करना होगा।</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">5. Book Seller Guidelines</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>केवल अपनी बनाई हुई या legally authorized content बेच सकते हैं।</li>
                <li>Copyright-protected material बेचना strictly prohibited है।</li>
                <li>Admin approval के बाद ही book visible होगी।</li>
                <li>हर book sale पर 2% platform commission लिया जाएगा।</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">6. Payment & Refund Policy</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>सभी payments Razorpay के through secure हैं।</li>
                <li>Class enrollment के लिए payment non-refundable है।</li>
                <li>Technical issues के case में Admin से contact करें।</li>
                <li>Classroom commission: 10% platform fee।</li>
                <li>Book sale commission: 2% platform fee।</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">7. Payout Policy</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Teacher और Seller अपने available balance का payout request कर सकते हैं।</li>
                <li>Payout processing में 1-3 business days लगते हैं।</li>
                <li>UPI या Bank Transfer के through payout होगा।</li>
                <li>Minimum payout amount: ₹100।</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">8. Healthcare & Medicine</h2>
              <p>Platform पर Healthcare/Medicine category केवल qualified और authorized professionals के लिए educational purpose के लिए है। Unauthorized medical practice, diagnosis, या prescription strictly prohibited है।</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">9. Privacy</h2>
              <p>आपकी personal information secure रखी जाती है। हम आपकी information किसी third party को नहीं बेचते। Payment details Razorpay द्वारा secure रूप से handle की जाती हैं।</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">10. Contact</h2>
              <p>किसी भी query के लिए हमसे contact करें:</p>
              <div className="mt-3 p-4 bg-orange-50 rounded-xl">
                <p>📧 Email: support@skillclass.in</p>
                <p>🌐 Website: skillclass-new.onrender.com</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xl font-bold text-orange-400 mb-2">🎓 SkillClass</p>
          <p className="text-gray-400 text-sm">© 2026 SkillClass. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-3 text-sm">
            <Link to="/terms" className="text-gray-400 hover:text-orange-400">Terms & Conditions</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-orange-400">Privacy Policy</Link>
            <Link to="/contact" className="text-gray-400 hover:text-orange-400">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}