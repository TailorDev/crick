package auth0

import (
	"fmt"
	"net/http"
	"reflect"
	"testing"

	"gopkg.in/square/go-jose.v2/jwt"
)

func TestFromRequestExtraction(t *testing.T) {

	headerTokenRequest, _ := http.NewRequest("", "http://localhost", nil)
	headerValue := fmt.Sprintf("Bearer %s", defaultToken)
	headerTokenRequest.Header.Add("Authorization", headerValue)

	token, err := FromHeader(headerTokenRequest)

	if err != nil {
		t.Error(err)
		return
	}

	claims := jwt.Claims{}
	err = token.Claims([]byte("secret"), &claims)
	if err != nil {
		t.Errorf("Claims should be decoded correctly with default token: %q \n", err)
		t.FailNow()
	}

	if claims.Issuer != defaultIssuer || !reflect.DeepEqual(claims.Audience, jwt.Audience(defaultAudience)) {
		t.Error("Invalid issuer, audience or subject:", claims.Issuer, claims.Audience)
	}
}
