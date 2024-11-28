package main

import (
	"time"

	"github.com/gin-gonic/gin"
	jwt "github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type TokenRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

const (
	AccessTokenSecret  = "qwertyuiopasdfghjklzxcvbnm123456"
	RefreshTokenSecret = "8f7d2b4c9e1a5f3d6b8c2e4a7d9f1b3e"
)

func main() {
	r := gin.Default()

	r.Use(func(ctx *gin.Context) {
		ctx.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		ctx.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")
		ctx.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if ctx.Request.Method == "OPTIONS" {
			ctx.AbortWithStatus(204)
			return
		}

		ctx.Next()
	})

	r.POST("/signup", signup)
	r.POST("/login", login)
	r.POST("/refresh", refresh)

	r.Run("localhost:8080")
}

func signup(c *gin.Context) {
	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to hash password"})
		return
	}

	user.Password = string(hashedPassword)

	c.JSON(200, gin.H{"message": "User created successfully"})
}

func login(c *gin.Context) {
	var req TokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	accessToken, err := generateAccessToken(req.Username)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to generate access token"})
		return
	}

	refreshToken, err := generateRefreshToken(req.Username)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to generate refresh token"})
		return
	}

	c.JSON(200, TokenResponse{AccessToken: accessToken, RefreshToken: refreshToken})
}

func refresh(c *gin.Context) {
	refreshToken := c.GetHeader("Authorization")
	if refreshToken == "" {
		c.JSON(400, gin.H{"error": "Refresh token is required"})
		return
	}

	token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
		return []byte(RefreshTokenSecret), nil
	})

	if err != nil || !token.Valid {
		c.JSON(400, gin.H{"error": "Invalid refresh token"})
		return
	}

	claims := token.Claims.(jwt.MapClaims)
	username := claims["username"].(string)

	newAccessToken, err := generateAccessToken(username)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to generate access token"})
		return
	}

	c.JSON(200, gin.H{"access_token": newAccessToken})
}

func generateAccessToken(username string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["username"] = username
	claims["exp"] = time.Now().Add(time.Minute * 15).Unix()

	return token.SignedString([]byte(AccessTokenSecret))
}

func generateRefreshToken(username string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["username"] = username
	claims["exp"] = time.Now().Add(time.Hour * 24 * 7).Unix()

	return token.SignedString([]byte(RefreshTokenSecret))
}
