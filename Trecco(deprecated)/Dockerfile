FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY Reclamao.sln .                        
COPY APIreclamao/*.csproj ./APIreclamao/   
COPY bibliotecaReclamao/*.csproj ./bibliotecaReclamao/

RUN dotnet restore Reclamao.sln

COPY APIreclamao ./APIreclamao/
COPY bibliotecaReclamao ./bibliotecaReclamao/

RUN dotnet publish "APIreclamao/APIreclamao.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 80
ENTRYPOINT ["dotnet", "APIreclamao.dll"]
