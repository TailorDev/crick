package auth0

var (
	// The default generated token by Chrome jwt extension
	defaultToken          = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdWJqZWN0IiwiaXNzIjoiaXNzdWVyIiwiYXVkIjoiYXVkaWVuY2UifQ.XjWtlyDjBoFDREk1WbvxriSdLve5jI7uyamzCiGdg9U"
	defaultAudience       = []string{"audience"}
	defaultIssuer         = "issuer"
	defaultSecretProvider = NewKeyProvider([]byte("secret"))
)
