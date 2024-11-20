#!/bin/bash
## fail in any error, and print commands
set -e

request_new_version() {
    # Prompt for the part to update
    echo "Do you want to update the major(M), minor(m), or patch(p) version? (Enter 'M', 'm', or 'p')"
    read -r -n 1 -p "" level
    case $level in
    "M")
        major=$(((${last_version:1:1} + 1)))
        version="v${major}.${last_version:3:1}.${last_version:5:1}"
        ;;
    "m")
        minor=$(((${last_version:3:1} + 1)))
        version="v${last_version:1:1}.${minor}.${last_version:5:1}"
        ;;
    "p")
        patch=$(((${last_version:5:1} + 1)))
        version="v${last_version:1:1}.${last_version:3:1}.${patch}"
        ;;
    "n")
        echo "not creating new release"
        ;;
    *)
        echo "Invalid choice. Please run the script again and enter major(M), minor(m), or patch(p)."
        exit 1
        ;;
    esac
    echo ""
    echo $version
}
create_release_github() {
    if [ $version !== $last_version ]; then
        curl -L \
            -X POST \
            -H "Accept: application/vnd.github+json" \
            -H "Authorization: Bearer $token" \
            -H "X-GitHub-Api-Version: 2022-11-28" \
            https://api.github.com/repos/helpbuttons/helpbuttons/releases \
            -d '{
            "tag_name": "'"$version"'",
            "target_commitish": "main",
            "name": "'"$version"'",
            "draft": false,
            "prerelease": false,
            "generate_release_notes": true
        }'
    fi
}

push_dockerhub() {
    echo "Do you want to push a new version to dockerhub?"
    read -r -n 1 -p "" push_dockerhub

    case $push_dockerhub in
    "y")
        ssh helpbuttons.org "cd /live/scripts/ && ./update_ver.sh ${version}"
        ;;
    *)
        echo "not building/pushing new version"
        ;;
    esac
}

release_new_version() {
    # change and pull master
    git checkout main
    git pull

    # Read version from file
    last_version=$(cat last_version)
    version=$(cat version)

    # List of diffs of last master/tag
    git_log_cmd=$(git log ${last_version}..HEAD --pretty=format:"%ad - %an - %s %h" --date="format:%d %b,%y")

    token=$(cat .github-token)

    create_release_github

    push_dockerhub
}

prepare_release() {
    last_version=$(cat version)
    request_new_version
    
    echo $version > web/public/version
    echo $version > api/src/version
    echo $last_version > last_version
    echo $version > version
}


echo "Do you want to upgrade dev(d), prepare new release(p), push new release(r) ?"
    read -r -n 1 -p "" push_dockerhub

    case $push_dockerhub in
    "p")
        prepare_release
        ;;
    "r")
        release_new_version
        ;;
    *)
        echo "not building/pushing new version"
        ;;
    esac